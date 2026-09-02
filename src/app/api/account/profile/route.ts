import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuthUserId } from "@/lib/cart-session";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(30).optional().nullable(),
});

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, email: true, phone: true },
    });
    return jsonSuccess(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    const input = updateProfileSchema.parse(await request.json());

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        phone: input.phone ?? undefined,
      },
      select: { name: true, email: true, phone: true },
    });

    return jsonSuccess(user);
  } catch (error) {
    return handleApiError(error);
  }
}
