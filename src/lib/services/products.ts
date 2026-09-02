import { prisma } from "@/lib/prisma";
import { filterActiveOffers } from "@/lib/live-offers";
import { calculateDiscount, parseSpecifications, parseTags } from "@/lib/utils";
import { ProductStatus, type Prisma, type Product } from "@prisma/client";

export const PRODUCT_SORT_OPTIONS = [
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
  "newest",
  "popular",
] as const;

export type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number];

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  isLimited?: boolean;
  isRare?: boolean;
  isFeatured?: boolean;
  onSale?: boolean;
  availability?: "in_stock" | "out_of_stock";
  page?: number;
  limit?: number;
}

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    variants: true;
    liveOffers: true;
  };
}>;

export function getEffectivePrice(
  product: Pick<Product, "price" | "salePrice">,
  activeOffer?: { salePrice: number } | null
): number {
  if (activeOffer) return activeOffer.salePrice;
  if (product.salePrice != null) return product.salePrice;
  return product.price;
}

export function enrichProduct(product: ProductWithRelations, now: Date = new Date()) {
  const activeOffer = filterActiveOffers(product.liveOffers, now)[0] ?? null;
  const effectivePrice = getEffectivePrice(product, activeOffer);
  const compareAtPrice = activeOffer?.salePrice
    ? activeOffer.normalPrice
    : product.compareAtPrice ?? product.price;
  const onSale =
    effectivePrice < compareAtPrice ||
    (product.salePrice != null && product.salePrice < product.price);

  return {
    ...product,
    tags: parseTags(product.tags),
    specifications: parseSpecifications(product.specifications),
    effectivePrice,
    compareAtPrice: onSale ? compareAtPrice : null,
    discount: onSale ? calculateDiscount(compareAtPrice, effectivePrice) : 0,
    onSale,
    activeOffer: activeOffer
      ? {
          id: activeOffer.id,
          salePrice: activeOffer.salePrice,
          normalPrice: activeOffer.normalPrice,
          discount: activeOffer.discount,
          endAt: activeOffer.endAt,
          badge: activeOffer.badge,
          customTitle: activeOffer.customTitle,
        }
      : null,
    liveOffers: undefined,
  };
}

function buildProductWhere(filters: ProductFilters, now: Date): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { brand: { contains: filters.search } },
      { description: { contains: filters.search } },
      { tags: { contains: filters.search } },
    ];
  }

  if (filters.category) {
    where.category = {
      OR: [{ slug: filters.category }, { id: filters.category }],
    };
  }

  if (filters.brand) {
    where.brand = { equals: filters.brand };
  }

  if (filters.isLimited !== undefined) {
    where.isLimited = filters.isLimited;
  }

  if (filters.isRare !== undefined) {
    where.isRare = filters.isRare;
  }

  if (filters.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured;
  }

  if (filters.availability === "in_stock") {
    where.stock = { gt: 0 };
  } else if (filters.availability === "out_of_stock") {
    where.stock = { lte: 0 };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  if (filters.onSale) {
    const onSaleCondition: Prisma.ProductWhereInput = {
      OR: [
        { salePrice: { not: null } },
        {
          liveOffers: {
            some: {
              enabled: true,
              startAt: { lte: now },
              endAt: { gt: now },
            },
          },
        },
      ],
    };
    where.AND = [...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), onSaleCondition];
  }

  return where;
}

function buildProductOrderBy(sort: ProductSort = "newest"): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "name-asc":
      return { name: "asc" };
    case "name-desc":
      return { name: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: true,
  liveOffers: { where: { enabled: true }, orderBy: { priority: "desc" as const } },
} satisfies Prisma.ProductInclude;

export async function getProducts(filters: ProductFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 12));
  const skip = (page - 1) * limit;
  const now = new Date();
  const where = buildProductWhere(filters, now);

  if (filters.sort === "popular") {
    const popularCounts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });
    const popularMap = new Map(popularCounts.map((p) => [p.productId, p._count.id]));

    const [allProducts, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productInclude,
      }),
      prisma.product.count({ where }),
    ]);

    const sorted = allProducts.sort((a, b) => {
      const aCount = popularMap.get(a.id) ?? 0;
      const bCount = popularMap.get(b.id) ?? 0;
      if (bCount !== aCount) return bCount - aCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const paged = sorted.slice(skip, skip + limit);
    return {
      products: paged.map((p) => enrichProduct(p, now)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: buildProductOrderBy(filters.sort),
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => enrichProduct(p, now)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductBySlug(slug: string) {
  const now = new Date();
  const product = await prisma.product.findFirst({
    where: { slug, status: ProductStatus.ACTIVE },
    include: productInclude,
  });

  if (!product) return null;
  return enrichProduct(product, now);
}

export type EnrichedProduct = ReturnType<typeof enrichProduct>;

export function toProductCardData(product: EnrichedProduct) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    salePrice: product.onSale ? product.effectivePrice : null,
    thumbnail: product.thumbnail ?? product.images[0]?.url ?? null,
    isLimited: product.isLimited,
    isRare: product.isRare,
    isNew: product.isNew,
    stock: product.stock,
    status: product.status,
  };
}

export async function searchProductSuggestions(query: string, limit = 8) {
  if (!query.trim()) return [];

  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      OR: [
        { name: { contains: query } },
        { brand: { contains: query } },
        { tags: { contains: query } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      brand: true,
      thumbnail: true,
      price: true,
      salePrice: true,
    },
    take: limit,
    orderBy: { name: "asc" },
  });

  return products;
}
