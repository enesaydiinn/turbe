import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin-auth";
import {
  type ApplicationStatus,
  SupabaseConfigError,
  updateApplicationReview,
} from "@/app/lib/supabase";

export const runtime = "nodejs";

const statuses = new Set<ApplicationStatus>([
  "accepted",
  "received",
  "rejected",
  "under_review",
]);

function text(value: unknown, maxLength = 2000) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && statuses.has(value as ApplicationStatus);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Admin oturumu gerekli." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Değerlendirme verisi okunamadı." },
      { status: 400 },
    );
  }

  const record =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const status = record.status;

  if (!isApplicationStatus(status)) {
    return NextResponse.json(
      { message: "Geçersiz başvuru durumu." },
      { status: 400 },
    );
  }

  try {
    const rows = await updateApplicationReview({
      id,
      reviewNotes:
        "reviewNotes" in record ? text(record.reviewNotes) : undefined,
      reviewedBy: session.username,
      status,
    });

    if (!rows[0]) {
      return NextResponse.json(
        { message: "Başvuru bulunamadı." },
        { status: 404 },
      );
    }

    return NextResponse.json({ application: rows[0], ok: true });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json(
        { message: "Supabase ortam değişkenleri eksik." },
        { status: 503 },
      );
    }

    console.error("Admin application update failed", error);
    return NextResponse.json(
      { message: "Başvuru güncellenirken bir sorun oluştu." },
      { status: 502 },
    );
  }
}
