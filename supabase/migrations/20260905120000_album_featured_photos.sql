alter table public.albums
  add column featured_public_ids text[];

update public.albums
set featured_public_ids = array[
  'Thirsty/Estiu-2026/mamma-mia-21-08/DAF04494',
  'Thirsty/Estiu-2026/mamma-mia-21-08/DAF05398',
  'Thirsty/Estiu-2026/mamma-mia-21-08/DAF05391'
]
where season = 'estiu-2026' and slug = 'mamma-mia-21-08';
