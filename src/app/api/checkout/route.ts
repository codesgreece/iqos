import { NextRequest } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/services/orders";
import { ensureGuestSessionId, getCartIdentity } from "@/lib/cart-session";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const checkoutSchema = z.object({
  email: z.email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().max(30).optional(),
  shippingAddress: z.string().min(1).max(500),
  shippingCity: z.string().min(1).max(100),
  shippingPostal: z.string().min(1).max(20),
  shippingCountry: z.string().length(2).optional(),
  couponCode: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),
  addressId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const input = checkoutSchema.parse(await request.json());
    const { userId, sessionId: existingSessionId } = await getCartIdentity();
    const sessionId = userId ? null : existingSessionId ?? (await ensureGuestSessionId());

    const order = await createOrder(input, userId, sessionId);

    return jsonSuccess(
      {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
