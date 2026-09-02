create extension if not exists pgcrypto;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  application_type text not null check (application_type in ('individual', 'panel')),
  status text not null default 'received' check (status in ('received', 'under_review', 'accepted', 'rejected')),
  full_name text not null,
  email text not null,
  phone text not null,
  country_city text not null,
  institution text not null,
  orcid text,
  profession text not null,
  academic_title text not null,
  topic text not null,
  paper_title text not null,
  panel_title text,
  presenting_author text not null,
  abstract_language text not null check (abstract_language in ('Türkçe', 'Arapça', 'İngilizce')),
  keywords text[] not null,
  abstract_text text not null,
  published_before boolean not null default false,
  speakers jsonb not null default '[]'::jsonb,
  notes text,
  review_notes text,
  reviewed_by text,
  reviewed_at timestamptz,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_keywords_count check (
    array_length(keywords, 1) between 3 and 5
  ),
  constraint applications_panel_requirements check (
    application_type = 'individual'
    or (
      panel_title is not null
      and jsonb_typeof(speakers) = 'array'
      and jsonb_array_length(speakers) >= 4
    )
  )
);

create index if not exists idx_applications_created_at
  on public.applications (created_at desc);

create index if not exists idx_applications_application_type
  on public.applications (application_type);

create index if not exists idx_applications_status
  on public.applications (status);

create index if not exists idx_applications_topic
  on public.applications (topic);

create index if not exists idx_applications_lower_email
  on public.applications (lower(email));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists applications_set_updated_at on public.applications;

create trigger applications_set_updated_at
before update on public.applications
for each row
execute function public.set_updated_at();

alter table public.applications enable row level security;

comment on table public.applications is
  'Uluslararası Türbeler Sempozyumu bildiri ve panel başvuruları.';

comment on column public.applications.speakers is
  'Panel başvuruları için tebliğci ad, kurum, e-posta ve tebliğ başlığı bilgileri.';

comment on column public.applications.review_notes is
  'Admin panelinde tutulan değerlendirme notları.';
