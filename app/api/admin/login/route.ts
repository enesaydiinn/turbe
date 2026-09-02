import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyAdminCredentials,
} from "@/app/lib/admin-auth";

export const runtime = "nodejs";

function text(value: unknown, maxLength = 160) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Giriş bilgileri okunamadı." },
      { status: 400 },
    );
  }

  const record =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const username = text(record.username);
  const password = text(record.password, 240);
  const result = verifyAdminCredentials(username, password);

  if (!result.configured) {
    return NextResponse.json(
      { message: "Admin giriş ortam değişkenleri eksik." },
      { status: 503 },
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      { message: "Kullanıcı adı veya şifre hatalı." },
      { status: 401 },
    );
  }

  const token = createAdminSessionToken(username);

  if (!token) {
    return NextResponse.json(
      { message: "Admin oturumu başlatılamadı." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE,
    name: ADMIN_COOKIE_NAME,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value: token,
  });

  return response;
}
