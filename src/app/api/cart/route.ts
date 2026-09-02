import { NextRequest } from "next/server";
import { z } from "zod";
import {
  addCartItem,
  getCart,
  getOrCreateCart,
  removeCartItem,
  serializeCart,
  updateCartItemQuantity,
} from "@/lib/services/cart";
import { ensureGuestSessionId, getCartIdentity } from "@/lib/cart-session";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const addItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional().nullable(),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

const updateItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

const removeItemSchema = z.object({
  itemId: z.string().min(1),
});

export async function GET() {
  try {
    const { userId, sessionId } = await getCartIdentity();
    const cart = await getCart(userId, sessionId);

    if (!cart) {
      return jsonSuccess({ id: null, items: [], subtotal: 0, itemCount: 0 });
    }

    return jsonSuccess(serializeCart(cart));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = addItemSchema.parse(await request.json());
    const { userId, sessionId: existingSessionId } = await getCartIdentity();
    const sessionId = userId ? null : existingSessionId ?? (await ensureGuestSessionId());

    const cart = await getOrCreateCart(userId, sessionId);
    const result = await addCartItem(
      cart.id,
      body.productId,
      body.quantity,
      body.variantId
    );

    return jsonSuccess(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = updateItemSchema.parse(await request.json());
    const { userId, sessionId } = await getCartIdentity();
    const sessionIdResolved = userId ? null : sessionId ?? (await ensureGuestSessionId());

    const cart = await getOrCreateCart(userId, sessionIdResolved);
    const result = await updateCartItemQuantity(cart.id, body.itemId, body.quantity);

    return jsonSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = removeItemSchema.parse(await request.json());
    const { userId, sessionId } = await getCartIdentity();
    const sessionIdResolved = userId ? null : sessionId ?? (await ensureGuestSessionId());

    const cart = await getOrCreateCart(userId, sessionIdResolved);
    const result = await removeCartItem(cart.id, body.itemId);

    return jsonSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
