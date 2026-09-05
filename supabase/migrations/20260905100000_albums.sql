create table public.albums (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  season text not null,
  date date not null,
  cloudinary_folder text not null,
  cover_public_id text,
  seo_title text,
  seo_description text,
  constraint albums_season_slug_key unique (season, slug)
);

alter table public.albums enable row level security;

revoke all on table public.albums from anon, authenticated;
grant select on table public.albums to anon, authenticated;

create policy "Public read albums"
  on public.albums for select to anon, authenticated using (true);

insert into public.albums (name, slug, season, date, cloudinary_folder)
values
  ('Mamma Mia', 'mamma-mia-21-08', 'estiu-2026', '2026-08-21', 'Thirsty/Estiu-2026/mamma-mia-21-08'),
  ('Back to the Future', 'back-to-the-future-05-08', 'estiu-2026', '2026-08-05', 'Thirsty/Estiu-2026/back-to-the-future-05-08'),
  ('Barbie', 'barbie-17-07', 'estiu-2026', '2026-07-17', 'Thirsty/Estiu-2026/barbie-17-07'),
  ('Hollywood Premiere', 'hollywood-premiere', 'estiu-2026', '2026-06-26', 'Thirsty/Estiu-2026/hollywood-premiere'),
  ('2n Aniversari', '2n-aniversari', 'estiu-2026', '2026-06-12', 'Thirsty/Estiu-2026/2n-aniversari')
on conflict (season, slug) do nothing;
