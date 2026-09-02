import { prisma } from "@/lib/prisma";
import { getEffectivePrice } from "@/lib/services/products";
import { filterActiveOffers } from "@/lib/live-offers";
import type { Prisma } from "@prisma/client";

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
          liveOffers: { where: { enabled: true }, orderBy: { priority: "desc" as const } },
        },
      },
      variant: true,
    },
    orderBy: { id: "asc" as const },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

function enrichCartItem(item: CartWithItems["items"][number]) {
  const activeOffer = filterActiveOffers(item.product.liveOffers)[0] ?? null;
  const unitPrice =
    item.variant?.price ??
    getEffectivePrice(item.product, activeOffer);
  const lineTotal = unitPrice * item.quantity;

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    unitPrice,
    lineTotal,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      thumbnail: item.product.thumbnail ?? item.product.images[0]?.url ?? null,
      stock: item.variant?.stock ?? item.product.stock,
      sku: item.variant?.sku ?? item.product.sku,
    },
    variant: item.variant
      ? { id: item.variant.id, name: item.variant.name, sku: item.variant.sku }
      : null,
  };
}

export function serializeCart(cart: CartWithItems) {
  const items = cart.items.map(enrichCartItem);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    items,
    subtotal,
    itemCount,
  };
}

export async function getOrCreateCart(userId?: string | null, sessionId?: string | null) {
  if (userId) {
    const existing = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
    if (existing) return existing;

    return prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }

  if (sessionId) {
    const existing = await prisma.cart.findUnique({
      where: { sessionId },
      include: cartInclude,
    });
    if (existing) return existing;

    return prisma.cart.create({
      data: { sessionId },
      include: cartInclude,
    });
  }

  throw new Error("Cart requires userId or sessionId");
}

export async function getCart(userId?: string | null, sessionId?: string | null) {
  if (userId) {
    return prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  }
  if (sessionId) {
    return prisma.cart.findUnique({ where: { sessionId }, include: cartInclude });
  }
  return null;
}

export async function addCartItem(
  cartId: string,
  productId: string,
  quantity: number,
  variantId?: string | null
) {
  const product = await prisma.product.findFirst({
    where: { id: productId, status: "ACTIVE" },
    include: { variants: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) throw new Error("Variant not found");
    if (variant.stock < quantity) throw new Error("Insufficient stock");
  } else if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  const existing = await prisma.cartItem.findFirst({
    where: { cartId, productId, variantId: variantId ?? null },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    const stock = variantId
      ? product.variants.find((v) => v.id === variantId)!.stock
      : product.stock;
    if (stock < newQty) throw new Error("Insufficient stock");

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId, productId, variantId: variantId ?? null, quantity },
    });
  }

  const cart = await prisma.cart.findUniqueOrThrow({
    where: { id: cartId },
    include: cartInclude,
  });

  return serializeCart(cart);
}

export async function updateCartItemQuantity(cartId: string, itemId: string, quantity: number) {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId },
    include: {
      product: { include: { variants: true } },
      variant: true,
    },
  });

  if (!item) throw new Error("Cart item not found");

  const stock = item.variant?.stock ?? item.product.stock;
  if (stock < quantity) throw new Error("Insufficient stock");

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  const cart = await prisma.cart.findUniqueOrThrow({
    where: { id: cartId },
    include: cartInclude,
  });

  return serializeCart(cart);
}

export async function removeCartItem(cartId: string, itemId: string) {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId },
  });

  if (!item) throw new Error("Cart item not found");

  await prisma.cartItem.delete({ where: { id: itemId } });

  const cart = await prisma.cart.findUniqueOrThrow({
    where: { id: cartId },
    include: cartInclude,
  });

  return serializeCart(cart);
}
