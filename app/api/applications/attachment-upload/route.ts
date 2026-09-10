import { NextResponse } from "next/server";
import {
  createApplicationAttachmentUpload,
  MAX_APPLICATION_ATTACHMENT_BYTES,
  normalizeApplicationAttachmentType,
  SupabaseConfigError,
} from "@/app/lib/supabase";

export const runtime = "nodejs";

function text(value: unknown, maxLength = 240) {
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
      { message: "Dosya yükleme bilgisi okunamadı." },
      { status: 400 },
    );
  }

  const record =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const fileName = text(record.fileName);
  const fileType = text(record.fileType, 180);
  const fileSize = Number(record.fileSize);
  const normalizedType = normalizeApplicationAttachmentType(fileName, fileType);

  if (!fileName || !normalizedType) {
    return NextResponse.json(
      { message: "Yalnızca PDF, DOC veya DOCX dosyası yükleyebilirsiniz." },
      { status: 400 },
    );
  }

  if (
    !Number.isFinite(fileSize) ||
    fileSize <= 0 ||
    fileSize > MAX_APPLICATION_ATTACHMENT_BYTES
  ) {
    return NextResponse.json(
      { message: "Dosya boyutu en fazla 5 MB olmalıdır." },
      { status: 400 },
    );
  }

  try {
    const upload = await createApplicationAttachmentUpload({
      fileName,
      fileSize,
      fileType: normalizedType,
    });

    return NextResponse.json({ ok: true, ...upload });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json(
        { message: "Supabase ortam değişkenleri eksik." },
        { status: 503 },
      );
    }

    console.error("Supabase attachment upload URL failed", error);
    return NextResponse.json(
      { message: "Dosya yükleme bağlantısı oluşturulamadı." },
      { status: 502 },
    );
  }
}
