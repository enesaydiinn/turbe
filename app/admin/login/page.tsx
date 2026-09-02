import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminAuthConfigured } from "@/app/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Giriş | Uluslararası Türbeler Sempozyumu",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <Link className="admin-back-link" href="/">
          TÜRÇEK Sempozyum Sitesi
        </Link>
        <div>
          <p className="eyebrow">Admin Paneli</p>
          <h1>Başvuru Değerlendirme Girişi</h1>
          <p>
            Uluslararası Türbeler Sempozyumu başvurularını görüntülemek ve
            değerlendirmek için giriş yapın.
          </p>
        </div>
        <LoginForm configured={isAdminAuthConfigured()} />
      </section>
    </main>
  );
}
