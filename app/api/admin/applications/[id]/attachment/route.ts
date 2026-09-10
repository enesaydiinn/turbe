import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/admin-auth";
import {
  createApplicationAttachmentSignedUrl,
  fetchApplicationById,
  SupabaseConfigError,
} from "@/app/lib/supabase";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
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

  try {
    const application = await fetchApplicationById(id);

    if (!application) {
      return NextResponse.json(
        { message: "Başvuru bulunamadı." },
        { status: 404 },
      );
    }

    const signedUrl = await createApplicationAttachmentSignedUrl(application);

    if (!signedUrl) {
      return NextResponse.json(
        { message: "Bu başvuruya bağlı dosya bulunmuyor." },
        { status: 404 },
      );
    }

    return NextResponse.redirect(signedUrl);
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return NextResponse.json(
        { message: "Supabase ortam değişkenleri eksik." },
        { status: 503 },
      );
    }

    console.error("Admin application attachment download failed", error);
    return NextResponse.json(
      { message: "Dosya indirme bağlantısı oluşturulamadı." },
      { status: 502 },
    );
  }
}
