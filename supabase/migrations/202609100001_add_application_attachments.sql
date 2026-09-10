alter table public.applications
  add column if not exists attachment_bucket text,
  add column if not exists attachment_path text,
  add column if not exists attachment_name text,
  add column if not exists attachment_type text,
  add column if not exists attachment_size integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'applications_attachment_size_limit'
  ) then
    alter table public.applications
      add constraint applications_attachment_size_limit
      check (
        attachment_size is null
        or (
          attachment_size > 0
          and attachment_size <= 5242880
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'applications_attachment_type_check'
  ) then
    alter table public.applications
      add constraint applications_attachment_type_check
      check (
        attachment_type is null
        or attachment_type in (
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      );
  end if;
end $$;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'application-files',
  'application-files',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on column public.applications.attachment_bucket is
  'Başvuru dosyasının Supabase Storage bucket bilgisi.';

comment on column public.applications.attachment_path is
  'Başvuru dosyasının Supabase Storage içindeki özel yolu.';

comment on column public.applications.attachment_name is
  'Katılımcının yüklediği PDF, DOC veya DOCX dosyasının orijinal adı.';

comment on column public.applications.attachment_size is
  'Başvuru dosyasının byte cinsinden boyutu. Üst sınır 5 MB.';
