import { prisma } from "@/lib/prisma";
import { handleApiError, jsonSuccess } from "@/lib/api-utils";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: { where: { status: "ACTIVE" } },
          },
        },
      },
    });

    const data = categories.map(({ _count, ...category }) => ({
      ...category,
      productCount: _count.products,
    }));

    return jsonSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
