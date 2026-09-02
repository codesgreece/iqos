import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError, jsonSuccess } from "@/lib/api-utils";

const registerSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.email(),
  password: z.string().min(8).max(128),
  phone: z.string().max(30).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = registerSchema.parse(await request.json());

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return jsonSuccess({ user }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
