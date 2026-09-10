import { randomUUID } from "node:crypto";

export type ApplicationStatus =
  | "accepted"
  | "received"
  | "rejected"
  | "under_review";

export type Speaker = {
  email: string;
  fullName: string;
  institution: string;
  paperTitle: string;
};

export const MAX_APPLICATION_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const applicationAttachmentTypes = new Map([
  ["pdf", "application/pdf"],
  ["doc", "application/msword"],
  [
    "docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
]);

export type ApplicationAttachment = {
  bucket: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  path: string;
};

export type SymposiumApplication = {
  abstract_language: string;
  abstract_text: string;
  academic_title: string;
  application_type: "individual" | "panel";
  attachment_bucket: string | null;
  attachment_name: string | null;
  attachment_path: string | null;
  attachment_size: number | null;
  attachment_type: string | null;
  country_city: string;
  created_at: string;
  email: string;
  full_name: string;
  id: string;
  institution: string;
  keywords: string[];
  notes: string | null;
  orcid: string | null;
  panel_title: string | null;
  paper_title: string;
  phone: string;
  presenting_author: string;
  profession: string;
  published_before: boolean;
  review_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  speakers: Speaker[];
  status: ApplicationStatus;
  topic: string;
  updated_at: string;
  user_agent: string | null;
};

export class SupabaseConfigError extends Error {
  constructor() {
    super("Supabase ortam değişkenleri eksik.");
  }
}

export function getSupabaseConfig() {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  )?.replace(/\/$/, "");
  const adminKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !adminKey) {
    return null;
  }

  return { adminKey, url };
}

export function getApplicationAttachmentBucket() {
  return process.env.SUPABASE_APPLICATION_FILES_BUCKET?.trim() || "application-files";
}

function supabaseAuthHeaders(adminKey: string) {
  const headers: Record<string, string> = {
    apikey: adminKey,
  };

  if (adminKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${adminKey}`;
  }

  return headers;
}

export function supabaseHeaders(adminKey: string) {
  const headers: Record<string, string> = {
    ...supabaseAuthHeaders(adminKey),
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  return headers;
}

function getAttachmentExtension(fileName: string) {
  return fileName.toLocaleLowerCase("tr-TR").match(/\.([a-z0-9]+)$/)?.[1] ?? "";
}

export function normalizeApplicationAttachmentType(
  fileName: string,
  fileType: string,
) {
  const expectedType = applicationAttachmentTypes.get(getAttachmentExtension(fileName));
  const normalizedType = fileType.trim().toLocaleLowerCase("tr-TR");

  if (!expectedType) {
    return "";
  }

  if (!normalizedType || normalizedType === "application/octet-stream") {
    return expectedType;
  }

  return normalizedType === expectedType ? expectedType : "";
}

function encodeStoragePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function sanitizeAttachmentFileName(fileName: string) {
  const extension = getAttachmentExtension(fileName);
  const baseName = fileName
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  const safeBaseName = baseName || "basvuru-dosyasi";

  return `${safeBaseName}.${extension}`;
}

function normalizeStorageUrl(value: string, supabaseUrl: string) {
  if (value.startsWith("http")) {
    return value;
  }

  if (value.startsWith("/storage/v1/")) {
    return `${supabaseUrl}${value}`;
  }

  return `${supabaseUrl}/storage/v1${value.startsWith("/") ? "" : "/"}${value}`;
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new SupabaseConfigError();
  }

  return fetch(`${config.url}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...supabaseHeaders(config.adminKey),
      ...init.headers,
    },
  });
}

export async function fetchApplications() {
  const response = await supabaseRequest(
    "/rest/v1/applications?select=*&order=created_at.desc",
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as SymposiumApplication[];
}

export async function fetchApplicationById(id: string) {
  const response = await supabaseRequest(
    `/rest/v1/applications?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = (await response.json()) as SymposiumApplication[];
  return rows[0] ?? null;
}

export async function insertApplication(
  application: Omit<
    SymposiumApplication,
    | "created_at"
    | "id"
    | "review_notes"
    | "reviewed_at"
    | "reviewed_by"
    | "status"
    | "updated_at"
  >,
) {
  const response = await supabaseRequest("/rest/v1/applications", {
    body: JSON.stringify(application),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as SymposiumApplication[];
}

export async function createApplicationAttachmentUpload({
  fileName,
  fileSize,
  fileType,
}: {
  fileName: string;
  fileSize: number;
  fileType: string;
}) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new SupabaseConfigError();
  }

  const normalizedType = normalizeApplicationAttachmentType(fileName, fileType);

  if (!normalizedType || fileSize > MAX_APPLICATION_ATTACHMENT_BYTES) {
    throw new Error("Geçersiz dosya yükleme isteği.");
  }

  const bucket = getApplicationAttachmentBucket();
  const path = [
    "applications",
    new Date().toISOString().slice(0, 10),
    `${randomUUID()}-${sanitizeAttachmentFileName(fileName)}`,
  ].join("/");
  const storageUrl = `${config.url}/storage/v1`;

  const response = await fetch(
    `${storageUrl}/object/upload/sign/${encodeURIComponent(bucket)}/${encodeStoragePath(path)}`,
    {
      body: JSON.stringify({}),
      cache: "no-store",
      headers: {
        ...supabaseHeaders(config.adminKey),
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = (await response.json()) as {
    signedURL?: string;
    signedUrl?: string;
    token?: string;
    url?: string;
  };
  const signedUrl = data.signedUrl ?? data.signedURL ?? data.url;

  if (!signedUrl) {
    throw new Error("Supabase yükleme bağlantısı oluşturulamadı.");
  }

  return {
    attachment: {
      bucket,
      fileName,
      fileSize,
      fileType: normalizedType,
      path,
    } satisfies ApplicationAttachment,
    uploadUrl: normalizeStorageUrl(signedUrl, config.url),
  };
}

export async function createApplicationAttachmentSignedUrl(
  application: SymposiumApplication,
  expiresIn = 300,
) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new SupabaseConfigError();
  }

  if (!application.attachment_bucket || !application.attachment_path) {
    return null;
  }

  const storageUrl = `${config.url}/storage/v1`;

  const response = await fetch(
    `${storageUrl}/object/sign/${encodeURIComponent(application.attachment_bucket)}/${encodeStoragePath(application.attachment_path)}`,
    {
      body: JSON.stringify({ expiresIn }),
      cache: "no-store",
      headers: {
        ...supabaseHeaders(config.adminKey),
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = (await response.json()) as {
    signedURL?: string;
    signedUrl?: string;
  };
  const signedUrl = data.signedUrl ?? data.signedURL;

  if (!signedUrl) {
    throw new Error("Supabase indirme bağlantısı oluşturulamadı.");
  }

  const url = new URL(normalizeStorageUrl(signedUrl, config.url));

  if (application.attachment_name) {
    url.searchParams.set("download", application.attachment_name);
  }

  return url.toString();
}

export async function updateApplicationReview({
  id,
  reviewNotes,
  reviewedBy,
  status,
}: {
  id: string;
  reviewNotes?: string;
  reviewedBy: string;
  status: ApplicationStatus;
}) {
  const updateBody: {
    review_notes?: string | null;
    reviewed_at: string;
    reviewed_by: string;
    status: ApplicationStatus;
  } = {
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewedBy,
    status,
  };

  if (reviewNotes !== undefined) {
    updateBody.review_notes = reviewNotes || null;
  }

  const response = await supabaseRequest(
    `/rest/v1/applications?id=eq.${encodeURIComponent(id)}`,
    {
      body: JSON.stringify(updateBody),
      method: "PATCH",
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as SymposiumApplication[];
}
