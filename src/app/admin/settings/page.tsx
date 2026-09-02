"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { SiteSettingsData } from "@/lib/settings";

const tabs = [
  "General",
  "Brand",
  "Store",
  "Payments",
  "Shipping",
  "Orders",
  "Notifications",
  "Social",
  "WhatsApp",
  "SEO",
  "Appearance",
] as const;

type Tab = (typeof tabs)[number];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  function updateSection<K extends keyof SiteSettingsData>(
    section: K,
    field: keyof SiteSettingsData[K],
    value: string | number | boolean
  ) {
    if (!settings) return;
    setSettings({
      ...settings,
      [section]: { ...settings[section], [field]: value },
    });
    setSaved(false);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
  }

  if (loading || !settings) {
    return <div className="h-64 skeleton rounded-[var(--card-radius)]" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-muted">Configure your store</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-lavender">Saved successfully</span>}
          <Button onClick={handleSave} loading={saving}>Save Settings</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-amethyst/30 text-lavender border border-violet/20"
                : "text-muted hover:text-white hover:bg-surface"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--card-radius)] border border-border bg-surface p-6">
        {activeTab === "General" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Store Name" value={settings.general.storeName} onChange={(e) => updateSection("general", "storeName", e.target.value)} />
            <Input label="Store Email" type="email" value={settings.general.storeEmail} onChange={(e) => updateSection("general", "storeEmail", e.target.value)} />
            <Input label="Store Phone" value={settings.general.storePhone} onChange={(e) => updateSection("general", "storePhone", e.target.value)} />
            <Input label="Currency" value={settings.general.currency} onChange={(e) => updateSection("general", "currency", e.target.value)} />
            <Input label="Timezone" value={settings.general.timezone} onChange={(e) => updateSection("general", "timezone", e.target.value)} />
          </div>
        )}

        {activeTab === "Brand" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Logo URL" value={settings.brand.logo} onChange={(e) => updateSection("brand", "logo", e.target.value)} />
            <Input label="Favicon URL" value={settings.brand.favicon} onChange={(e) => updateSection("brand", "favicon", e.target.value)} />
            <div className="sm:col-span-2">
              <Input label="Tagline" value={settings.brand.tagline} onChange={(e) => updateSection("brand", "tagline", e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === "Store" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Free Shipping Threshold" type="number" step="0.01" value={String(settings.store.freeShippingThreshold)} onChange={(e) => updateSection("store", "freeShippingThreshold", parseFloat(e.target.value))} />
            <Input label="Default Shipping Cost" type="number" step="0.01" value={String(settings.store.defaultShippingCost)} onChange={(e) => updateSection("store", "defaultShippingCost", parseFloat(e.target.value))} />
            <Input label="Tax Rate (%)" type="number" value={String(settings.store.taxRate)} onChange={(e) => updateSection("store", "taxRate", parseFloat(e.target.value))} />
          </div>
        )}

        {activeTab === "Payments" && (
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.payments.stripeEnabled} onChange={(e) => updateSection("payments", "stripeEnabled", e.target.checked)} className="accent-violet" />
              <span className="text-sm text-white">Stripe Enabled</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.payments.codEnabled} onChange={(e) => updateSection("payments", "codEnabled", e.target.checked)} className="accent-violet" />
              <span className="text-sm text-white">Cash on Delivery Enabled</span>
            </label>
          </div>
        )}

        {activeTab === "Shipping" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Default Country" value={settings.shipping.defaultCountry} onChange={(e) => updateSection("shipping", "defaultCountry", e.target.value)} />
            <Input label="Estimated Delivery" value={settings.shipping.estimatedDays} onChange={(e) => updateSection("shipping", "estimatedDays", e.target.value)} />
          </div>
        )}

        {activeTab === "Orders" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Order Number Prefix" value={settings.orders.prefix} onChange={(e) => updateSection("orders", "prefix", e.target.value)} />
            <label className="flex items-center gap-3 self-end pb-2 cursor-pointer">
              <input type="checkbox" checked={settings.orders.autoConfirm} onChange={(e) => updateSection("orders", "autoConfirm", e.target.checked)} className="accent-violet" />
              <span className="text-sm text-white">Auto Confirm Orders</span>
            </label>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.notifications.orderConfirmation} onChange={(e) => updateSection("notifications", "orderConfirmation", e.target.checked)} className="accent-violet" />
              <span className="text-sm text-white">Order Confirmation Emails</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.notifications.lowStockAlert} onChange={(e) => updateSection("notifications", "lowStockAlert", e.target.checked)} className="accent-violet" />
              <span className="text-sm text-white">Low Stock Alerts</span>
            </label>
          </div>
        )}

        {activeTab === "Social" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Instagram" value={settings.social.instagram} onChange={(e) => updateSection("social", "instagram", e.target.value)} />
            <Input label="Facebook" value={settings.social.facebook} onChange={(e) => updateSection("social", "facebook", e.target.value)} />
            <Input label="Twitter" value={settings.social.twitter} onChange={(e) => updateSection("social", "twitter", e.target.value)} />
            <Input label="TikTok" value={settings.social.tiktok} onChange={(e) => updateSection("social", "tiktok", e.target.value)} />
          </div>
        )}

        {activeTab === "WhatsApp" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 cursor-pointer sm:col-span-2">
              <input type="checkbox" checked={settings.whatsapp.enabled} onChange={(e) => updateSection("whatsapp", "enabled", e.target.checked)} className="accent-violet" />
              <span className="text-sm text-white">WhatsApp Enabled</span>
            </label>
            <Input label="Phone Number" value={settings.whatsapp.number} onChange={(e) => updateSection("whatsapp", "number", e.target.value)} />
            <div className="sm:col-span-2">
              <Input label="Default Message" value={settings.whatsapp.message} onChange={(e) => updateSection("whatsapp", "message", e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="grid gap-4">
            <Input label="Meta Title" value={settings.seo.title} onChange={(e) => updateSection("seo", "title", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Meta Description</label>
              <textarea
                value={settings.seo.description}
                onChange={(e) => updateSection("seo", "description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-[var(--button-radius)] text-white focus:outline-none focus:border-lavender/50"
              />
            </div>
            <Input label="Keywords" value={settings.seo.keywords} onChange={(e) => updateSection("seo", "keywords", e.target.value)} />
          </div>
        )}

        {activeTab === "Appearance" && (
          <div className="grid gap-4 sm:grid-cols-3">
            {(["background", "surface", "amethyst", "violet", "lavender", "white", "muted"] as const).map((color) => (
              <Input
                key={color}
                label={color.charAt(0).toUpperCase() + color.slice(1)}
                value={settings.appearance[color]}
                onChange={(e) => updateSection("appearance", color, e.target.value)}
              />
            ))}
            <Input label="Card Radius" value={settings.appearance.cardRadius} onChange={(e) => updateSection("appearance", "cardRadius", e.target.value)} />
            <Input label="Button Radius" value={settings.appearance.buttonRadius} onChange={(e) => updateSection("appearance", "buttonRadius", e.target.value)} />
            <Input label="Font Family" value={settings.appearance.fontFamily} onChange={(e) => updateSection("appearance", "fontFamily", e.target.value)} />
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-muted mb-1.5">Custom CSS</label>
              <textarea
                value={settings.appearance.customCss}
                onChange={(e) => updateSection("appearance", "customCss", e.target.value)}
                rows={5}
                className="w-full font-mono text-sm px-4 py-2.5 bg-background border border-border rounded-[var(--button-radius)] text-white focus:outline-none focus:border-lavender/50"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
