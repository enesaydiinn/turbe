import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/app/lib/admin-auth";
import {
  fetchApplications,
  SupabaseConfigError,
  type SymposiumApplication,
} from "@/app/lib/supabase";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel | Uluslararası Türbeler Sempozyumu",
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let applications: SymposiumApplication[] = [];
  let errorMessage = "";

  try {
    applications = await fetchApplications();
  } catch (error) {
    errorMessage =
      error instanceof SupabaseConfigError
        ? "Supabase ortam değişkenleri eksik. Vercel Environment Variables içinde Supabase admin anahtarını tanımlayın."
        : "Başvurular Supabase üzerinden okunamadı. Migration ve environment ayarlarını kontrol edin.";
  }

  return (
    <AdminDashboard
      adminName={session.username}
      applications={applications}
      errorMessage={errorMessage}
    />
  );
}
