import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { ToastProvider } from "@/context/ToastContext";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | FINAL BOSS ACTIVITY",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <AdminShell isAdmin={isAdmin}>{children}</AdminShell>
      </ToastProvider>
    </SessionProvider>
  );
}
