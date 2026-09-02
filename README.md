# Uluslararası Türbeler Sempozyumu

TÜRÇEK için hazırlanan Uluslararası Türbeler Sempozyumu tanıtım ve başvuru sitesi.
Uygulama Vercel üzerinde Next.js olarak çalışacak, başvuruları Supabase
Postgres veritabanındaki `applications` tablosuna kaydedecek şekilde düzenlendi.

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` içinde şu değerleri doldurun:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` yalnızca sunucu tarafındaki başvuru API route'unda
kullanılır. Bu değeri istemci tarafında veya `NEXT_PUBLIC_` önekiyle
tanımlamayın.

## Supabase Migration

Supabase SQL Editor veya Supabase CLI üzerinden şu migration dosyasını
çalıştırın:

```bash
supabase/migrations/202609020001_create_applications.sql
```

Migration `public.applications` tablosunu, indeksleri, panel başvurusu için en
az dört tebliğci kontrolünü, 3-5 anahtar kelime kontrolünü, `updated_at`
trigger'ını ve RLS ayarını oluşturur. API route service role anahtarıyla
yazdığı için ek public insert policy gerektirmez.

## Vercel Yayını

Vercel projesinde aşağıdaki ortam değişkenlerini tanımlayın:

```bash
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` değerini canlı Vercel domain'iyle güncelleyin. Vercel
build komutu `npm run build`, geliştirme komutu `npm run dev` olarak ayarlı.

## Komutlar

```bash
npm run dev
npm run build
npm test
npm run lint
```
