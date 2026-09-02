import { prisma } from "./prisma";

export interface SiteSettingsData {
  general: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    currency: string;
    timezone: string;
  };
  brand: {
    logo: string;
    favicon: string;
    tagline: string;
  };
  store: {
    freeShippingThreshold: number;
    defaultShippingCost: number;
    taxRate: number;
  };
  payments: {
    stripeEnabled: boolean;
    codEnabled: boolean;
  };
  shipping: {
    defaultCountry: string;
    estimatedDays: string;
  };
  orders: {
    prefix: string;
    autoConfirm: boolean;
  };
  notifications: {
    orderConfirmation: boolean;
    lowStockAlert: boolean;
  };
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    message: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  appearance: {
    background: string;
    surface: string;
    amethyst: string;
    violet: string;
    lavender: string;
    white: string;
    muted: string;
    borderColor: string;
    borderHover: string;
    cardRadius: string;
    buttonRadius: string;
    fontFamily: string;
    customCss: string;
  };
  legal: {
    ageVerification: boolean;
    minimumAge: number;
    termsUrl: string;
    privacyUrl: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  general: {
    storeName: "FINAL BOSS ACTIVITY",
    storeEmail: "contact@finalbossactivity.com",
    storePhone: "",
    currency: "EUR",
    timezone: "Europe/Athens",
  },
  brand: {
    logo: "",
    favicon: "",
    tagline: "Rare. Limited. Unforgettable.",
  },
  store: {
    freeShippingThreshold: 100,
    defaultShippingCost: 5.99,
    taxRate: 24,
  },
  payments: {
    stripeEnabled: false,
    codEnabled: true,
  },
  shipping: {
    defaultCountry: "GR",
    estimatedDays: "2-5 business days",
  },
  orders: {
    prefix: "FBA",
    autoConfirm: false,
  },
  notifications: {
    orderConfirmation: true,
    lowStockAlert: true,
  },
  social: {
    instagram: "",
    facebook: "",
    twitter: "",
    tiktok: "",
  },
  whatsapp: {
    enabled: true,
    number: "306900000000",
    message: "Hello! I have a question about FINAL BOSS ACTIVITY.",
  },
  seo: {
    title: "FINAL BOSS ACTIVITY | Rare & Limited Edition Products",
    description:
      "Discover rare and limited-edition products selected for collectors who want something different.",
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

export async function getSettings(): Promise<SiteSettingsData> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    await prisma.siteSettings.create({
      data: { id: "default", data: JSON.stringify(DEFAULT_SETTINGS) },
    });
    return DEFAULT_SETTINGS;
  }

  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(settings.data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(updates: Partial<SiteSettingsData>): Promise<SiteSettingsData> {
  const current = await getSettings();
  const merged = deepMerge(
    current as unknown as Record<string, unknown>,
    updates as unknown as Record<string, unknown>
  ) as unknown as SiteSettingsData;

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", data: JSON.stringify(merged) },
    update: { data: JSON.stringify(merged) },
  });

  return merged;
}

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target } as T;
  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceVal = source[key];
    const targetVal = target[key];
    if (
      sourceVal &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === "object"
    ) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>
      ) as T[keyof T];
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal as T[keyof T];
    }
  }
  return result;
}
