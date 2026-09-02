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

export type SymposiumApplication = {
  abstract_language: string;
  abstract_text: string;
  academic_title: string;
  application_type: "individual" | "panel";
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

export function supabaseHeaders(adminKey: string) {
  const headers: Record<string, string> = {
    apikey: adminKey,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  if (adminKey.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${adminKey}`;
  }

  return headers;
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
