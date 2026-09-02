type Speaker = {
  fullName: string;
  institution: string;
  email: string;
  paperTitle: string;
};

type ApplicationPayload = {
  applicationType: "individual" | "panel";
  fullName: string;
  email: string;
  phone: string;
  countryCity: string;
  institution: string;
  orcid: string;
  profession: string;
  academicTitle: string;
  topic: string;
  paperTitle: string;
  panelTitle: string;
  presentingAuthor: string;
  abstractLanguage: string;
  keywords: string;
  abstractText: string;
  publishedBefore: string;
  notes: string;
  consent: boolean;
  speakers: Speaker[];
};

type SupabaseApplication = {
  id: string;
};

export const runtime = "nodejs";

function text(value: unknown, maxLength = 1200) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function wordCount(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function keywordList(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function normalizeSpeakers(value: unknown): Speaker[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((speaker) => {
      const record =
        typeof speaker === "object" && speaker !== null
          ? (speaker as Record<string, unknown>)
          : {};

      return {
        fullName: text(record.fullName, 160),
        institution: text(record.institution, 220),
        email: text(record.email, 180),
        paperTitle: text(record.paperTitle, 300),
      };
    })
    .filter((speaker) =>
      Object.values(speaker).some((field) => field.length > 0),
    );
}

function normalizePayload(value: unknown): ApplicationPayload {
  const record =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};
  const applicationType =
    record.applicationType === "panel" ? "panel" : "individual";

  return {
    applicationType,
    fullName: text(record.fullName, 180),
    email: text(record.email, 180),
    phone: text(record.phone, 80),
    countryCity: text(record.countryCity, 180),
    institution: text(record.institution, 240),
    orcid: text(record.orcid, 80),
    profession: text(record.profession, 120),
    academicTitle: text(record.academicTitle, 120),
    topic: text(record.topic, 240),
    paperTitle: text(record.paperTitle, 300),
    panelTitle: text(record.panelTitle, 300),
    presentingAuthor: text(record.presentingAuthor, 180),
    abstractLanguage: text(record.abstractLanguage, 80),
    keywords: text(record.keywords, 320),
    abstractText: text(record.abstractText, 3200),
    publishedBefore: record.publishedBefore === "yes" ? "yes" : "no",
    notes: text(record.notes, 1600),
    consent: record.consent === true,
    speakers: normalizeSpeakers(record.speakers),
  };
}

function validatePayload(payload: ApplicationPayload) {
  const requiredFields = [
    payload.fullName,
    payload.email,
    payload.phone,
    payload.countryCity,
    payload.institution,
    payload.profession,
    payload.academicTitle,
    payload.topic,
    payload.paperTitle,
    payload.presentingAuthor,
    payload.abstractLanguage,
    payload.keywords,
    payload.abstractText,
  ];

  if (requiredFields.some((field) => field.length === 0)) {
    return "Lütfen zorunlu alanları doldurun.";
  }

  if (!payload.email.includes("@")) {
    return "Geçerli bir e-posta adresi girin.";
  }

  const abstractWordCount = wordCount(payload.abstractText);
  if (abstractWordCount < 150 || abstractWordCount > 300) {
    return "Özet metni 150-300 kelime aralığında olmalıdır.";
  }

  const keywords = keywordList(payload.keywords);
  if (keywords.length < 3 || keywords.length > 5) {
    return "Anahtar kelimeler 3-5 ifade arasında olmalıdır.";
  }

  if (!["Türkçe", "Arapça", "İngilizce"].includes(payload.abstractLanguage)) {
    return "Özet dili Türkçe, Arapça veya İngilizce olmalıdır.";
  }

  if (payload.applicationType === "panel") {
    if (!payload.panelTitle) {
      return "Panel konusu zorunludur.";
    }

    const completeSpeakers = payload.speakers.filter(
      (speaker) =>
        speaker.fullName &&
        speaker.institution &&
        speaker.email.includes("@") &&
        speaker.paperTitle,
    );

    if (completeSpeakers.length < 4) {
      return "Panel başvurusu için en az dört tebliğci bilgisi gereklidir.";
    }
  }

  if (!payload.consent) {
    return "Kişisel veri onayı zorunludur.";
  }

  return "";
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { serviceRoleKey, url };
}

export async function POST(request: Request) {
  const supabase = getSupabaseConfig();

  if (!supabase) {
    return Response.json(
      {
        message:
          "Başvuru kayıt sistemi için Supabase ortam değişkenleri eksik.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Başvuru verisi okunamadı." },
      { status: 400 },
    );
  }

  const payload = normalizePayload(body);
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    return Response.json({ message: validationMessage }, { status: 400 });
  }

  const response = await fetch(`${supabase.url}/rest/v1/applications`, {
    method: "POST",
    headers: {
      apikey: supabase.serviceRoleKey,
      Authorization: `Bearer ${supabase.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      application_type: payload.applicationType,
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      country_city: payload.countryCity,
      institution: payload.institution,
      orcid: payload.orcid || null,
      profession: payload.profession,
      academic_title: payload.academicTitle,
      topic: payload.topic,
      paper_title: payload.paperTitle,
      panel_title: payload.panelTitle || null,
      presenting_author: payload.presentingAuthor,
      abstract_language: payload.abstractLanguage,
      keywords: keywordList(payload.keywords),
      abstract_text: payload.abstractText,
      published_before: payload.publishedBefore === "yes",
      speakers: payload.speakers,
      notes: payload.notes || null,
      user_agent: request.headers.get("user-agent"),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Supabase application insert failed", details);
    return Response.json(
      { message: "Başvuru kaydedilirken bir sorun oluştu." },
      { status: 502 },
    );
  }

  const rows = (await response.json()) as SupabaseApplication[];

  return Response.json({ id: rows[0]?.id ?? null, ok: true });
}
