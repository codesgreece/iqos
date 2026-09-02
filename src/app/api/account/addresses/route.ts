import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuthUserId } from "@/lib/cart-session";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const addressSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().max(30).optional(),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2).default("GR"),
  isDefault: z.boolean().optional(),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });
    return jsonSuccess(addresses);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    const input = addressSchema.parse(await request.json());

    const count = await prisma.address.count({ where: { userId } });
    const isDefault = input.isDefault ?? count === 0;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        address: input.address,
        city: input.city,
        postalCode: input.postalCode,
        country: input.country,
        isDefault,
      },
    });

    return jsonSuccess(address, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    const { id } = deleteSchema.parse(await request.json());

    await prisma.address.deleteMany({
      where: { id, userId },
    });

    return jsonSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
