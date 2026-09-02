import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireAdmin();

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        type: body.type,
        value: parseFloat(body.value),
        minOrderAmount: body.minOrderAmount ? parseFloat(body.minOrderAmount) : null,
        maxDiscount: body.maxDiscount ? parseFloat(body.maxDiscount) : null,
        startAt: body.startAt ? new Date(body.startAt) : null,
        endAt: body.endAt ? new Date(body.endAt) : null,
        usageLimit: body.usageLimit ? parseInt(body.usageLimit, 10) : null,
        perCustomerLimit: body.perCustomerLimit ? parseInt(body.perCustomerLimit, 10) : null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.update({
      where: { id: body.id },
      data: {
        code: body.code?.toUpperCase(),
        type: body.type,
        value: body.value !== undefined ? parseFloat(body.value) : undefined,
        minOrderAmount: body.minOrderAmount !== undefined
          ? body.minOrderAmount ? parseFloat(body.minOrderAmount) : null
          : undefined,
        maxDiscount: body.maxDiscount !== undefined
          ? body.maxDiscount ? parseFloat(body.maxDiscount) : null
          : undefined,
        startAt: body.startAt !== undefined ? (body.startAt ? new Date(body.startAt) : null) : undefined,
        endAt: body.endAt !== undefined ? (body.endAt ? new Date(body.endAt) : null) : undefined,
        usageLimit: body.usageLimit !== undefined
          ? body.usageLimit ? parseInt(body.usageLimit, 10) : null
          : undefined,
        perCustomerLimit: body.perCustomerLimit !== undefined
          ? body.perCustomerLimit ? parseInt(body.perCustomerLimit, 10) : null
          : undefined,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
