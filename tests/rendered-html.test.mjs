import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the symposium homepage content in place", async () => {
  const [page, layout, countdown, committeeTabs, registrationForm] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/components/Countdown.tsx", import.meta.url), "utf8"),
      readFile(
        new URL("../app/components/CommitteeTabs.tsx", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../app/components/RegistrationForm.tsx", import.meta.url),
        "utf8",
      ),
    ]);

  assert.match(page, /RegistrationForm/);
  assert.match(page, /Countdown/);
  assert.match(page, /CommitteeTabs/);
  assert.match(page, /Uluslararası Türbeler Sempozyumu/);
  assert.match(page, /31 Mart - 1 Nisan 2027/);
  assert.match(page, /2027-03-31T09:00:00\+03:00/);
  assert.match(page, /Kur’ân ve Sünnet Perspektifinde Türbeler/);
  assert.match(page, /İstanbul Valiliği/);
  assert.match(page, /Özet Kılavuzu/);
  assert.match(page, /Sekreterya/);
  assert.match(page, /TÜRÇEK/);
  assert.match(page, /turcek-logo\.png/);
  assert.match(page, /İş birliği yapılan kurumlar/);
  assert.match(page, /Fatih Belediye Başkanlığı/);
  assert.match(page, /Kocaeli Büyükşehir Belediyesi/);
  assert.match(page, /info@turbeler\.org\.tr/);
  assert.match(layout, /NEXT_PUBLIC_SITE_URL/);
  assert.match(layout, /VERCEL_PROJECT_PRODUCTION_URL/);
  assert.match(layout, /parseSiteUrl/);
  assert.match(layout, /Uluslararası Türbeler Sempozyumu/);
  assert.match(countdown, /setInterval/);
  assert.match(countdown, /Sempozyuma kalan süre/);
  assert.match(committeeTabs, /useState/);
  assert.match(committeeTabs, /role="tablist"/);
  assert.match(committeeTabs, /committee-person-card/);
  assert.match(registrationForm, /attachmentFile/);
  assert.match(registrationForm, /maxAttachmentBytes = 5 \* 1024 \* 1024/);
  assert.match(registrationForm, /\/api\/applications\/attachment-upload/);
});

test("is configured for Vercel and Supabase", async () => {
  const [
    route,
    uploadRoute,
    supabaseLib,
    migration,
    reviewMigration,
    attachmentMigration,
    packageJson,
    envExample,
    vercelConfig,
  ] = await Promise.all([
    readFile(new URL("../app/api/applications/route.ts", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../app/api/applications/attachment-upload/route.ts",
        import.meta.url,
      ),
      "utf8",
    ),
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
    readFile(
      new URL(
        "../supabase/migrations/202609100001_add_application_attachments.sql",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);

  assert.match(route, /insertApplication/);
  assert.match(route, /attachment_path/);
  assert.match(uploadRoute, /createApplicationAttachmentUpload/);
  assert.match(uploadRoute, /MAX_APPLICATION_ATTACHMENT_BYTES/);
  assert.match(supabaseLib, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(supabaseLib, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(supabaseLib, /SUPABASE_SECRET_KEY/);
  assert.match(supabaseLib, /adminKey\.startsWith\("eyJ"\)/);
  assert.match(supabaseLib, /\/rest\/v1\/applications/);
  assert.match(supabaseLib, /createApplicationAttachmentSignedUrl/);
  assert.match(supabaseLib, /\/object\/upload\/sign/);
  assert.doesNotMatch(route, /cloudflare:workers|D1Database/);
  assert.match(migration, /create table if not exists public\.applications/);
  assert.match(migration, /jsonb_array_length\(speakers\) >= 4/);
  assert.match(migration, /array_length\(keywords, 1\) between 3 and 5/);
  assert.match(migration, /review_notes text/);
  assert.match(reviewMigration, /add column if not exists review_notes text/);
  assert.match(attachmentMigration, /attachment_path text/);
  assert.match(attachmentMigration, /storage\.buckets/);
  assert.match(attachmentMigration, /5242880/);
  assert.match(packageJson, /"build": "next build"/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(envExample, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(envExample, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(envExample, /SUPABASE_SECRET_KEY/);
  assert.match(envExample, /SUPABASE_APPLICATION_FILES_BUCKET/);
  assert.match(envExample, /ADMIN_USERNAME/);
  assert.match(envExample, /ADMIN_PASSWORD/);
  assert.match(envExample, /ADMIN_SESSION_SECRET/);
  assert.match(vercelConfig, /"framework": "nextjs"/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/hero-turbeler.png", import.meta.url));
  await access(new URL("../public/turcek-logo.png", import.meta.url));
  await access(new URL("../public/partners/fatih-belediyesi.png", import.meta.url));
  await access(new URL("../public/partners/istanbul-valiligi.png", import.meta.url));
  await access(
    new URL("../public/partners/istanbul-il-kultur-turizm.jpeg", import.meta.url),
  );
  await access(
    new URL("../public/partners/turkiye-yazma-eserler.png", import.meta.url),
  );
  await access(new URL("../public/partners/kocaeli-buyuksehir.png", import.meta.url));
});

test("includes protected admin review pages", async () => {
  const [
    adminPage,
    adminDashboard,
    loginPage,
    authLib,
    supabaseLib,
    updateRoute,
    attachmentRoute,
  ] = await Promise.all([
    readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/admin/AdminDashboard.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/admin/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/admin-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/supabase.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../app/api/admin/applications/[id]/route.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/api/admin/applications/[id]/attachment/route.ts",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  assert.match(adminPage, /getAdminSession/);
  assert.match(adminPage, /fetchApplications/);
  assert.match(adminDashboard, /turcek-logo\.png/);
  assert.match(adminDashboard, /admin-download-link/);
  assert.match(adminDashboard, /attachment_name/);
  assert.match(loginPage, /LoginForm/);
  assert.match(authLib, /ADMIN_COOKIE_NAME/);
  assert.match(authLib, /timingSafeEqual/);
  assert.match(supabaseLib, /updateApplicationReview/);
  assert.match(updateRoute, /Admin oturumu gerekli/);
  assert.match(attachmentRoute, /createApplicationAttachmentSignedUrl/);
  assert.match(attachmentRoute, /Admin oturumu gerekli/);
});
