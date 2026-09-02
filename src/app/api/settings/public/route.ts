import { getSettings } from "@/lib/settings";
import { jsonSuccess } from "@/lib/api-utils";

export async function GET() {
  const settings = await getSettings();
  return jsonSuccess({
    payments: settings.payments,
    store: {
      freeShippingThreshold: settings.store.freeShippingThreshold,
      defaultShippingCost: settings.store.defaultShippingCost,
    },
    general: {
      currency: settings.general.currency,
      storeName: settings.general.storeName,
    },
  });
}
