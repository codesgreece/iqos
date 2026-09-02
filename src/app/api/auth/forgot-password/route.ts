import { NextRequest } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const forgotPasswordSchema = z.object({
  email: z.email(),
});

const RESET_TOKEN_EXPIRY_HOURS = 1;

export async function POST(request: NextRequest) {
  try {
    const { email } = forgotPasswordSchema.parse(await request.json());

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid email enumeration
    if (!user || !user.password) {
      return jsonSuccess({
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expires },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

    if (process.env.NODE_ENV === "development") {
      return jsonSuccess({
        message: "If an account exists with this email, a reset link has been sent.",
        resetUrl,
      });
    }

    // TODO: Send email with resetUrl in production
    return jsonSuccess({
      message: "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
