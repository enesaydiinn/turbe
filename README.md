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
NEXT_PUBLIC_SUPABASE_URL=https://fsxyhalmihldguiwxydg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_eQ29YFpV2dOSOb5abmvizQ_vf-pFoc8
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# SUPABASE_SECRET_KEY=sb_secret_your-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` veya yeni format kullanıyorsanız
`SUPABASE_SECRET_KEY` yalnızca sunucu tarafındaki başvuru API route'unda
kullanılır. Bu değerleri istemci tarafında veya `NEXT_PUBLIC_` önekiyle
tanımlamayın. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` tarayıcı tarafında
kullanılabilir public anahtardır; başvuru kayıtları güvenlik için server API
üzerinden admin anahtarıyla yazılır.

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
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
# veya yeni anahtar yapısına geçtiyseniz SUPABASE_SECRET_KEY
NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` değerini canlı Vercel domain'iyle güncelleyin; yalnızca
`https://` bırakmayın, örnek olarak `https://turbe.vercel.app` gibi tam domain
girin. Bu değer boş veya hatalı olursa uygulama Vercel'in kendi domain
değerlerine, yerelde ise `http://localhost:3000` adresine düşer. Vercel build
komutu `npm run build`, geliştirme komutu `npm run dev` olarak ayarlı.

## Komutlar

```bash
npm run dev
npm run build
npm test
npm run lint
```
