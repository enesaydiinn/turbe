import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the symposium homepage content in place", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /RegistrationForm/);
  assert.match(page, /Uluslararası Türbeler Sempozyumu/);
  assert.match(page, /1-3 Nisan 2027/);
  assert.match(page, /Kur'an ve Sünnet Perspektifinde Türbeler/);
  assert.match(page, /TÜRÇEK/);
  assert.match(layout, /NEXT_PUBLIC_SITE_URL/);
  assert.match(layout, /Uluslararası Türbeler Sempozyumu/);
});

test("is configured for Vercel and Supabase", async () => {
  const [route, migration, packageJson, envExample, vercelConfig] =
    await Promise.all([
      readFile(new URL("../app/api/applications/route.ts", import.meta.url), "utf8"),
      readFile(
        new URL(
          "../supabase/migrations/202609020001_create_applications.sql",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../.env.example", import.meta.url), "utf8"),
      readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    ]);

  assert.match(route, /SUPABASE_URL/);
  assert.match(route, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(route, /\/rest\/v1\/applications/);
  assert.doesNotMatch(route, /cloudflare:workers|D1Database/);
  assert.match(migration, /create table if not exists public\.applications/);
  assert.match(migration, /jsonb_array_length\(speakers\) >= 4/);
  assert.match(migration, /array_length\(keywords, 1\) between 3 and 5/);
  assert.match(packageJson, /"build": "next build"/);
  assert.match(envExample, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(vercelConfig, /"framework": "nextjs"/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/hero-turbeler.png", import.meta.url));
});
