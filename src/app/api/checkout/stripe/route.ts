import { NextRequest } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { createOrder } from "@/lib/services/orders";
import { ensureGuestSessionId, getCartIdentity } from "@/lib/cart-session";
import { getSettings } from "@/lib/settings";
import { handleApiError, jsonError, jsonSuccess } from "@/lib/api-utils";

const checkoutSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().max(30).optional(),
  shippingAddress: z.string().min(1).max(500),
  shippingCity: z.string().min(1).max(100),
  shippingPostal: z.string().min(1).max(20),
  shippingCountry: z.string().length(2).optional(),
  couponCode: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const settings = await getSettings();
    if (!settings.payments.stripeEnabled) {
      return jsonError("Stripe is not enabled", 400);
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return jsonError("Stripe is not configured", 500);
    }

    const input = checkoutSchema.parse(await request.json());
    const { userId, sessionId: existingSessionId } = await getCartIdentity();
    const sessionId = userId ? null : existingSessionId ?? (await ensureGuestSessionId());

    const order = await createOrder(input, userId, sessionId);

    const stripe = new Stripe(stripeKey);
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.email,
      line_items: [
        {
          price_data: {
            currency: settings.general.currency.toLowerCase(),
            product_data: {
              name: `Order ${order.orderNumber}`,
              description: "FINAL BOSS ACTIVITY",
            },
            unit_amount: Math.round(order.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      success_url: `${baseUrl}/checkout/success?order=${order.orderNumber}`,
      cancel_url: `${baseUrl}/checkout?cancelled=true`,
    });

    await stripe.checkout.sessions.update(session.id, {
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    });

    return jsonSuccess({ url: session.url, orderNumber: order.orderNumber });
  } catch (error) {
    return handleApiError(error);
  }
}
