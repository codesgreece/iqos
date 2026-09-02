import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const { email } = schema.parse(await request.json());

    await prisma.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase() },
      create: { email: email.toLowerCase() },
      update: {},
    });

    return jsonSuccess({ message: "Subscribed successfully" }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
