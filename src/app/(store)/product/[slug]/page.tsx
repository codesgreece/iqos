import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/services/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductJsonLd } from "@/components/product/ProductJsonLd";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return {
    title: product.seoTitle ?? `${product.name} | FINAL BOSS ACTIVITY`,
    description: product.seoDescription ?? product.shortDescription ?? product.description,
    alternates: {
      canonical: `${baseUrl}/product/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.thumbnail ? [{ url: product.thumbnail }] : undefined,
      url: `${baseUrl}/product/${product.slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const galleryImages = product.images.length > 0
    ? product.images.map((img) => ({ url: img.url, alt: img.alt }))
    : product.thumbnail
      ? [{ url: product.thumbnail, alt: product.name }]
      : [];

  return (
    <>
      <ProductJsonLd product={product} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={galleryImages} productName={product.name} />
          <ProductInfo product={product} />
        </div>
      </div>
    </>
  );
}
