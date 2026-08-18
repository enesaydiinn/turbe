import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the symposium homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Uluslararası Türbeler Sempozyumu/);
  assert.match(html, /1-3 Nisan 2027/);
  assert.match(html, /Bildiri Başvurusu Yap/);
  assert.match(html, /Sempozyum Tebliğ Çağrısı/);
  assert.match(html, /Kur&#x27;an ve Sünnet Perspektifinde Türbeler|Kur&#39;an ve Sünnet Perspektifinde Türbeler|Kur'an ve Sünnet Perspektifinde Türbeler/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("keeps site assets and persistence configuration in place", async () => {
  const [page, layout, hostingConfig, packageJson, migration] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../drizzle/0000_spooky_lockjaw.sql", import.meta.url), "utf8"),
    ]);

  assert.match(page, /RegistrationForm/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /Uluslararası Türbeler Sempozyumu/);
  assert.match(hostingConfig, /"d1": "DB"/);
  assert.match(migration, /CREATE TABLE `applications`/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/hero-turbeler.png", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
