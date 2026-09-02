alter table public.applications
  add column if not exists review_notes text,
  add column if not exists reviewed_by text,
  add column if not exists reviewed_at timestamptz;

create index if not exists idx_applications_status
  on public.applications (status);

comment on column public.applications.review_notes is
  'Admin panelinde tutulan değerlendirme notları.';
