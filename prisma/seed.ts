import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const customerPassword = await bcrypt.hash("customer123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@smoka.com" },
    update: {},
    create: {
      email: "admin@smoka.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Demo Customer",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+30 690 000 0000",
    },
  });

  await prisma.wishlist.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "devices" },
      update: {},
      create: {
        name: "Devices",
        slug: "devices",
        description: "Premium limited-edition devices for collectors",
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Exclusive accessories and add-ons",
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "limited-drops" },
      update: {},
      create: {
        name: "Limited Drops",
        slug: "limited-drops",
        description: "Rare limited edition drops",
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bundles" },
      update: {},
      create: {
        name: "Bundles",
        slug: "bundles",
        description: "Curated collector bundles",
        sortOrder: 4,
        isActive: true,
      },
    }),
  ]);

  const products = [
    {
      name: "ILUMA PRIME STARDUST",
      slug: "iluma-prime-stardust",
      sku: "SMK-ILUMA-SD-001",
      brand: "IQOS",
      categoryId: categories[0].id,
      description:
        "A rare limited-edition device featuring a stunning stardust finish. Crafted for collectors who demand exclusivity. This premium piece combines cutting-edge technology with an unforgettable aesthetic.",
      shortDescription: "Limited edition stardust finish device for collectors",
      price: 119.99,
      compareAtPrice: 149.99,
      stock: 12,
      status: "ACTIVE" as const,
      isLimited: true,
      isRare: true,
      isFeatured: true,
      isNew: true,
      tags: JSON.stringify(["limited", "stardust", "collector", "premium"]),
      specifications: JSON.stringify({
        "Finish": "Stardust Metallic",
        "Edition": "Limited — 500 units worldwide",
        "Color": "Cosmic Purple",
        "Warranty": "12 months",
      }),
      seoTitle: "ILUMA PRIME STARDUST | Limited Edition | SMOKA",
      seoDescription: "Rare ILUMA PRIME STARDUST limited edition device. Only 500 units worldwide.",
    },
    {
      name: "ILUMA ONE OBSIDIAN",
      slug: "iluma-one-obsidian",
      sku: "SMK-ILUMA-OB-002",
      brand: "IQOS",
      categoryId: categories[0].id,
      description:
        "Sleek obsidian black finish in a compact form factor. A statement piece for the modern collector who values both form and function.",
      shortDescription: "Compact obsidian black limited device",
      price: 89.99,
      compareAtPrice: null,
      stock: 25,
      status: "ACTIVE" as const,
      isLimited: true,
      isRare: false,
      isFeatured: true,
      isNew: false,
      tags: JSON.stringify(["obsidian", "compact", "black"]),
      specifications: JSON.stringify({
        "Finish": "Obsidian Black",
        "Form Factor": "Compact",
        "Color": "Black",
      }),
    },
    {
      name: "TEREA AMBER COLLECTION",
      slug: "terea-amber-collection",
      sku: "SMK-TEREA-AM-003",
      brand: "TEREA",
      categoryId: categories[1].id,
      description:
        "Exclusive amber collection pack. A curated selection for the discerning enthusiast. Limited availability.",
      shortDescription: "Exclusive amber collection pack",
      price: 34.99,
      stock: 50,
      status: "ACTIVE" as const,
      isLimited: false,
      isRare: true,
      isFeatured: true,
      isNew: true,
      tags: JSON.stringify(["terea", "amber", "collection"]),
    },
    {
      name: "PREMIUM CARRY CASE LEATHER",
      slug: "premium-carry-case-leather",
      sku: "SMK-CASE-LT-004",
      brand: "SMOKA",
      categoryId: categories[1].id,
      description:
        "Handcrafted genuine leather carry case with amethyst accent stitching. Protects your device in premium style.",
      shortDescription: "Genuine leather carry case with amethyst accents",
      price: 49.99,
      stock: 30,
      status: "ACTIVE" as const,
      isLimited: false,
      isRare: false,
      isFeatured: false,
      isNew: true,
      tags: JSON.stringify(["case", "leather", "accessory"]),
    },
    {
      name: "COLLECTOR BUNDLE ELITE",
      slug: "collector-bundle-elite",
      sku: "SMK-BND-EL-005",
      brand: "SMOKA",
      categoryId: categories[3].id,
      description:
        "The ultimate collector bundle. Includes limited device, premium case, and exclusive accessories. Only 50 bundles available.",
      shortDescription: "Ultimate collector bundle — 50 units only",
      price: 249.99,
      compareAtPrice: 319.99,
      stock: 8,
      lowStockThreshold: 10,
      status: "ACTIVE" as const,
      isLimited: true,
      isRare: true,
      isFeatured: true,
      isNew: true,
      tags: JSON.stringify(["bundle", "elite", "collector"]),
    },
    {
      name: "ILUMA PRIME MIDNIGHT",
      slug: "iluma-prime-midnight",
      sku: "SMK-ILUMA-MN-006",
      brand: "IQOS",
      categoryId: categories[2].id,
      description:
        "Midnight edition with deep purple undertones. A rare drop that sold out once — now restocked in limited quantities.",
      shortDescription: "Midnight purple limited drop",
      price: 129.99,
      stock: 3,
      lowStockThreshold: 5,
      status: "ACTIVE" as const,
      isLimited: true,
      isRare: true,
      isFeatured: false,
      isNew: false,
      tags: JSON.stringify(["midnight", "purple", "drop"]),
    },
    {
      name: "CLEANING KIT PRO",
      slug: "cleaning-kit-pro",
      sku: "SMK-CLN-PR-007",
      brand: "SMOKA",
      categoryId: categories[1].id,
      description: "Professional-grade cleaning kit for device maintenance.",
      shortDescription: "Professional cleaning kit",
      price: 19.99,
      stock: 100,
      status: "ACTIVE" as const,
      isLimited: false,
      isRare: false,
      isFeatured: false,
      isNew: false,
      tags: JSON.stringify(["cleaning", "maintenance"]),
    },
    {
      name: "ILUMA PRIME GOLD EDITION",
      slug: "iluma-prime-gold-edition",
      sku: "SMK-ILUMA-GD-008",
      brand: "IQOS",
      categoryId: categories[2].id,
      description:
        "Ultra-rare gold edition. Numbered piece for the most dedicated collectors. Only 100 units ever produced.",
      shortDescription: "Ultra-rare numbered gold edition — 100 units",
      price: 199.99,
      compareAtPrice: 249.99,
      stock: 5,
      lowStockThreshold: 5,
      status: "ACTIVE" as const,
      isLimited: true,
      isRare: true,
      isFeatured: true,
      isNew: false,
      tags: JSON.stringify(["gold", "numbered", "ultra-rare"]),
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData,
    });

    const existingImages = await prisma.productImage.count({
      where: { productId: product.id },
    });

    if (existingImages === 0) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://placehold.co/600x600/1A1426/D8B4FE?text=${encodeURIComponent(product.name.split(" ").slice(0, 2).join("+"))}`,
          alt: product.name,
          sortOrder: 0,
        },
      });
    }
  }

  const stardust = await prisma.product.findUnique({
    where: { slug: "iluma-prime-stardust" },
  });

  if (stardust) {
    const now = new Date();
    const startAt = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const endAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    await prisma.liveOffer.upsert({
      where: { id: "seed-offer-stardust" },
      update: {},
      create: {
        id: "seed-offer-stardust",
        productId: stardust.id,
        normalPrice: 119.99,
        salePrice: 99.99,
        discount: 17,
        startAt,
        endAt,
        badge: "LIVE OFFER",
        priority: 10,
        enabled: true,
        customTitle: "ILUMA PRIME STARDUST",
        customDescription: "Limited time offer on our most popular collector piece",
      },
    });
  }

  const goldEdition = await prisma.product.findUnique({
    where: { slug: "iluma-prime-gold-edition" },
  });

  if (goldEdition) {
    const now = new Date();
    const startAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endAt = new Date(now.getTime() + 72 * 60 * 60 * 1000);

    await prisma.liveOffer.create({
      data: {
        productId: goldEdition.id,
        normalPrice: 199.99,
        salePrice: 169.99,
        discount: 15,
        startAt,
        endAt,
        badge: "COMING SOON",
        priority: 5,
        enabled: true,
      },
    }).catch(() => {});
  }

  await prisma.banner.upsert({
    where: { id: "seed-banner-1" },
    update: {},
    create: {
      id: "seed-banner-1",
      title: "LIMITED EDITION DROP",
      subtitle: "Discover the latest rare arrivals.",
      ctaText: "SHOP NOW",
      ctaLink: "/limited-editions",
      priority: 10,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 50,
      maxDiscount: 30,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "LIMITED20" },
    update: {},
    create: {
      code: "LIMITED20",
      type: "PERCENTAGE",
      value: 20,
      minOrderAmount: 100,
      maxDiscount: 50,
      isActive: true,
    },
  });

  const defaultSettings = {
    general: {
      storeName: "SMOKA",
      storeEmail: "contact@smoka.com",
      storePhone: "+30 210 000 0000",
      currency: "EUR",
      timezone: "Europe/Athens",
    },
    brand: {
      logo: "/smoka-logo.jpg",
      favicon: "/smoka-logo.jpg",
      tagline: "Rare • Limited • Exclusive",
    },
    store: {
      freeShippingThreshold: 100,
      defaultShippingCost: 5.99,
      taxRate: 24,
    },
    payments: { stripeEnabled: false, codEnabled: true },
    shipping: { defaultCountry: "GR", estimatedDays: "2-5 business days" },
    orders: { prefix: "SMK", autoConfirm: false },
    notifications: { orderConfirmation: true, lowStockAlert: true },
    social: {
      instagram: "https://instagram.com/smoka",
      facebook: "",
      twitter: "",
      tiktok: "",
    },
    whatsapp: {
      enabled: true,
      number: "306900000000",
      message: "Hello! I have a question about SMOKA.",
    },
    seo: {
      title: "SMOKA | Rare & Limited Edition Products",
      description: "Discover rare and limited-edition products selected for collectors who want something different.",
      keywords: "limited edition, rare, collector, premium",
    },
    appearance: {
      background: "#0D0B14",
      surface: "#1A1426",
      amethyst: "#4C1D95",
      violet: "#7E22CE",
      lavender: "#D8B4FE",
      white: "#FFFFFF",
      muted: "#A9A3B5",
      borderColor: "rgba(216, 180, 254, 0.12)",
      borderHover: "rgba(216, 180, 254, 0.30)",
      cardRadius: "14px",
      buttonRadius: "10px",
      fontFamily: "Inter",
      customCss: "",
    },
    legal: {
      ageVerification: true,
      minimumAge: 18,
      termsUrl: "/legal/terms",
      privacyUrl: "/legal/privacy",
    },
  };

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: { data: JSON.stringify(defaultSettings) },
    create: { id: "default", data: JSON.stringify(defaultSettings) },
  });

  console.log("Seed completed!");
  console.log("Admin: admin@smoka.com / admin123");
  console.log("Customer: customer@example.com / customer123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
