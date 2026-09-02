"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  configured: boolean;
};

type FormStatus = "error" | "idle" | "submitting";

export function LoginForm({ configured }: LoginFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configured) {
      setStatus("error");
      setMessage("Admin giriş bilgileri henüz ortam değişkenlerinde tanımlı değil.");
      return;
    }

    const form = new FormData(event.currentTarget);

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        body: JSON.stringify({
          password: String(form.get("password") ?? ""),
          username: String(form.get("username") ?? ""),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Giriş yapılamadı.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Giriş sırasında bir sorun oluştu.",
      );
    }
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Kullanıcı adı</span>
        <input
          autoComplete="username"
          disabled={!configured || status === "submitting"}
          name="username"
          required
          type="text"
        />
      </label>
      <label className="field">
        <span>Şifre</span>
        <input
          autoComplete="current-password"
          disabled={!configured || status === "submitting"}
          name="password"
          required
          type="password"
        />
      </label>
      <button disabled={!configured || status === "submitting"} type="submit">
        {status === "submitting" ? "Giriş yapılıyor" : "Giriş yap"}
      </button>
      {message ? (
        <p className={`admin-form-message ${status}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
