# Thirsty Experiences

Aplicació Next.js amb Supabase, preparada per desplegar-se a Vercel amb el domini
`https://thirsty.cat`.

## Variables d'entorn de Vercel

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL=https://thirsty.cat`
- `NEXT_PUBLIC_INSTAGRAM_URL` (opcional; té un valor per defecte)
- `NEXT_PUBLIC_TIKTOK_URL` (opcional; té un valor per defecte)
- `NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL` (opcional; té un valor per defecte)

`SUPABASE_SERVICE_ROLE_KEY` només és necessària per als scripts interns d'importació i
verificació. No s'ha d'exposar al navegador.

## Desplegament

Vercel detecta Next.js automàticament i utilitza `npm run build`. Després d'importar el
repositori, cal afegir `thirsty.cat` i `www.thirsty.cat` a **Settings → Domains**, fer
`thirsty.cat` el domini principal i redirigir `www.thirsty.cat` cap a l'arrel. Els
registres DNS han de ser exactament els que indiqui Vercel.
