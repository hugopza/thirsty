# Thirsty Experiences

Aplicació Next.js amb Supabase. `npm run build` genera l'exportació estàtica a
`out/`, inclòs `out/index.html`.

El workflow de GitHub Pages publica temporalment la branca `main` a:

`https://hugopza.github.io/thirsty/`

Cal definir aquests secrets al repositori:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

A **Settings → Pages**, la font de publicació ha de ser **GitHub Actions**.
