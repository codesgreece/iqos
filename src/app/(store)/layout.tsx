import { auth } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AgeGate } from "@/components/layout/AgeGate";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <ThemeProvider appearance={settings.appearance}>
        <ToastProvider>
          <CartProvider>
            <AgeGate
              enabled={settings.legal.ageVerification}
              minimumAge={settings.legal.minimumAge}
            />
            <Header logo={settings.brand.logo} storeName={settings.general.storeName} />
            <main className="flex-1">{children}</main>
            <Footer storeName={settings.general.storeName} social={settings.social} />
            <WhatsAppButton settings={settings.whatsapp} />
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
