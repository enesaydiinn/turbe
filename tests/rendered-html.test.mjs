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
  assert.match(layout, /VERCEL_PROJECT_PRODUCTION_URL/);
  assert.match(layout, /parseSiteUrl/);
  assert.match(layout, /Uluslararası Türbeler Sempozyumu/);
});

test("is configured for Vercel and Supabase", async () => {
  const [
    route,
    supabaseLib,
    migration,
    reviewMigration,
    packageJson,
    envExample,
    vercelConfig,
  ] = await Promise.all([
      readFile(new URL("../app/api/applications/route.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/lib/supabase.ts", import.meta.url), "utf8"),
      readFile(
        new URL(
          "../supabase/migrations/202609020001_create_applications.sql",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../supabase/migrations/202609020002_add_application_review_fields.sql",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../.env.example", import.meta.url), "utf8"),
      readFile(new URL("../vercel.json", import.meta.url), "utf8"),
    ]);

  assert.match(route, /insertApplication/);
  assert.match(supabaseLib, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(supabaseLib, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(supabaseLib, /SUPABASE_SECRET_KEY/);
  assert.match(supabaseLib, /adminKey\.startsWith\("eyJ"\)/);
  assert.match(supabaseLib, /\/rest\/v1\/applications/);
  assert.doesNotMatch(route, /cloudflare:workers|D1Database/);
  assert.match(migration, /create table if not exists public\.applications/);
  assert.match(migration, /jsonb_array_length\(speakers\) >= 4/);
  assert.match(migration, /array_length\(keywords, 1\) between 3 and 5/);
  assert.match(migration, /review_notes text/);
  assert.match(reviewMigration, /add column if not exists review_notes text/);
  assert.match(packageJson, /"build": "next build"/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(envExample, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(envExample, /SUPABASE_SECRET_KEY/);
  assert.match(envExample, /ADMIN_USERNAME/);
  assert.match(envExample, /ADMIN_PASSWORD/);
  assert.match(envExample, /ADMIN_SESSION_SECRET/);
  assert.match(vercelConfig, /"framework": "nextjs"/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/hero-turbeler.png", import.meta.url));
});

test("includes protected admin review pages", async () => {
  const [adminPage, loginPage, authLib, supabaseLib, updateRoute] =
    await Promise.all([
      readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/admin/login/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/lib/admin-auth.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/lib/supabase.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../app/api/admin/applications/[id]/route.ts", import.meta.url),
        "utf8",
      ),
    ]);

  assert.match(adminPage, /getAdminSession/);
  assert.match(adminPage, /fetchApplications/);
  assert.match(loginPage, /LoginForm/);
  assert.match(authLib, /ADMIN_COOKIE_NAME/);
  assert.match(authLib, /timingSafeEqual/);
  assert.match(supabaseLib, /updateApplicationReview/);
  assert.match(updateRoute, /Admin oturumu gerekli/);
});
