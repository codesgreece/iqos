import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const customer = await prisma.user.findFirst({
      where: { id, role: "CUSTOMER" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: { select: { name: true, quantity: true, total: true } },
          },
        },
        _count: { select: { orders: true } },
      },
    });

    if (!customer) {
      return jsonSuccess(null, 404);
    }

    const totalSpent = customer.orders.reduce((sum, o) => sum + o.total, 0);

    return jsonSuccess({ ...customer, totalSpent });
  } catch (error) {
    return handleApiError(error);
  }
}
