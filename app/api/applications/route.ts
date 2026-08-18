import { env } from "cloudflare:workers";

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
  profession: string;
  academicTitle: string;
  topic: string;
  paperTitle: string;
  panelTitle: string;
  abstractText: string;
  publishedBefore: string;
  notes: string;
  consent: boolean;
  speakers: Speaker[];
};

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
    profession: text(record.profession, 120),
    academicTitle: text(record.academicTitle, 120),
    topic: text(record.topic, 240),
    paperTitle: text(record.paperTitle, 300),
    panelTitle: text(record.panelTitle, 300),
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

    if (completeSpeakers.length < 2) {
      return "Panel başvurusu için en az iki tebliğci bilgisi gereklidir.";
    }
  }

  if (!payload.consent) {
    return "Kişisel veri onayı zorunludur.";
  }

  return "";
}

async function ensureApplicationSchema(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      application_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'received',
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      country_city TEXT NOT NULL,
      institution TEXT NOT NULL,
      profession TEXT NOT NULL,
      academic_title TEXT NOT NULL,
      topic TEXT NOT NULL,
      paper_title TEXT NOT NULL,
      panel_title TEXT,
      abstract_text TEXT NOT NULL,
      published_before TEXT NOT NULL,
      speakers_json TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_applications_type ON applications (application_type)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications (created_at)",
    ),
  ]);
}

export async function POST(request: Request) {
  if (!env.DB) {
    return Response.json(
      { message: "Başvuru kayıt sistemi henüz hazır değil." },
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

  const id = crypto.randomUUID();

  await ensureApplicationSchema(env.DB);
  await env.DB.prepare(
    `INSERT INTO applications (
      id,
      application_type,
      full_name,
      email,
      phone,
      country_city,
      institution,
      profession,
      academic_title,
      topic,
      paper_title,
      panel_title,
      abstract_text,
      published_before,
      speakers_json,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      payload.applicationType,
      payload.fullName,
      payload.email,
      payload.phone,
      payload.countryCity,
      payload.institution,
      payload.profession,
      payload.academicTitle,
      payload.topic,
      payload.paperTitle,
      payload.panelTitle || null,
      payload.abstractText,
      payload.publishedBefore,
      payload.speakers.length ? JSON.stringify(payload.speakers) : null,
      payload.notes || null,
    )
    .run();

  return Response.json({ id, ok: true });
}
