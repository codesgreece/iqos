import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getEffectivePrice } from "@/lib/services/products";
import { getOrCreateCart, serializeCart, type CartWithItems } from "@/lib/services/cart";
import { filterActiveOffers } from "@/lib/live-offers";
import { generateOrderNumber } from "@/lib/utils";
import type { DiscountType } from "@prisma/client";

export interface CheckoutInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingCountry?: string;
  couponCode?: string;
  notes?: string;
  addressId?: string;
}

function calculateCouponDiscount(
  subtotal: number,
  coupon: {
    type: DiscountType;
    value: number;
    minOrderAmount: number | null;
    maxDiscount: number | null;
  }
): number {
  if (coupon.minOrderAmount != null && subtotal < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount of €${coupon.minOrderAmount} required for this coupon`);
  }

  let discount =
    coupon.type === "PERCENTAGE"
      ? (subtotal * coupon.value) / 100
      : coupon.value;

  if (coupon.maxDiscount != null) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return Math.min(discount, subtotal);
}

async function validateCoupon(code: string, subtotal: number, userId?: string | null) {
  const now = new Date();
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    throw new Error("Invalid coupon code");
  }

  if (coupon.startAt && coupon.startAt > now) {
    throw new Error("Coupon is not yet active");
  }

  if (coupon.endAt && coupon.endAt < now) {
    throw new Error("Coupon has expired");
  }

  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  if (userId && coupon.perCustomerLimit != null) {
    const userUsage = await prisma.order.count({
      where: { userId, couponId: coupon.id },
    });
    if (userUsage >= coupon.perCustomerLimit) {
      throw new Error("Coupon usage limit reached for this customer");
    }
  }

  const discount = calculateCouponDiscount(subtotal, coupon);
  return { coupon, discount };
}

async function resolveCartItems(cart: CartWithItems) {
  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const lineItems: Array<{
    productId: string;
    variantId: string | null;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    total: number;
  }> = [];

  for (const item of cart.items) {
    if (item.product.status !== "ACTIVE") {
      throw new Error(`Product "${item.product.name}" is no longer available`);
    }

    const activeOffer = filterActiveOffers(item.product.liveOffers)[0] ?? null;
    const unitPrice =
      item.variant?.price ?? getEffectivePrice(item.product, activeOffer);
    const stock = item.variant?.stock ?? item.product.stock;

    if (stock < item.quantity) {
      throw new Error(`Insufficient stock for "${item.product.name}"`);
    }

    lineItems.push({
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      sku: item.variant?.sku ?? item.product.sku,
      price: unitPrice,
      quantity: item.quantity,
      total: unitPrice * item.quantity,
    });
  }

  return lineItems;
}

export async function createOrder(
  input: CheckoutInput,
  userId?: string | null,
  sessionId?: string | null
) {
  const cart = await getOrCreateCart(userId, sessionId);
  const lineItems = await resolveCartItems(cart);
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);

  const settings = await getSettings();
  let discount = 0;
  let couponId: string | undefined;
  let couponCode: string | undefined;

  if (input.couponCode) {
    const result = await validateCoupon(input.couponCode, subtotal, userId);
    discount = result.discount;
    couponId = result.coupon.id;
    couponCode = result.coupon.code;
  }

  const shipping =
    subtotal >= settings.store.freeShippingThreshold
      ? 0
      : settings.store.defaultShippingCost;

  const total = Math.max(0, subtotal - discount + shipping);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: userId ?? null,
        email: input.email,
        phone: input.phone ?? null,
        firstName: input.firstName,
        lastName: input.lastName,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        shippingPostal: input.shippingPostal,
        shippingCountry: input.shippingCountry ?? settings.shipping.defaultCountry,
        subtotal,
        discount,
        shipping,
        total,
        couponId: couponId ?? null,
        couponCode: couponCode ?? null,
        notes: input.notes ?? null,
        addressId: input.addressId ?? null,
        status: settings.orders.autoConfirm ? "CONFIRMED" : "PENDING",
        items: {
          create: lineItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of cart.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } },
      });
    }

    return created;
  });

  return order;
}

export { serializeCart };
