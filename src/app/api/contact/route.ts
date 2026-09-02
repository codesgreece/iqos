import { NextRequest } from "next/server";
import { z } from "zod";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    schema.parse(await request.json());
    // In production, integrate with email provider (Resend, SendGrid, etc.)
    return jsonSuccess({ message: "Message received" });
  } catch (error) {
    return handleApiError(error);
  }
}
