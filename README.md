# Nearloom

Nearloom is a location-aware discovery platform for real communities, clubs, and collectives. It helps people find a relevant group and then continue on the channel that group already uses. It is intentionally a directory and trust layer, not another social feed.

## Stack

- React 18 and TypeScript
- Vite 5
- Tailwind CSS and Radix UI
- TanStack Query
- Supabase Auth, PostgreSQL, Storage, and Row Level Security
- Zod for listing validation
- pnpm 11

## Local setup

Requirements: Node.js 20.19 or newer and pnpm 11.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Set the following values in `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_APP_URL=http://localhost:8080
```

Only use a Supabase publishable/anon key in browser environment variables. Never expose a service-role key to Vite.

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

The production output is written to `dist/`.

## Database

The current schema and RLS policies live in `supabase/migrations/`. Apply them to a linked project with the Supabase CLI before deploying the frontend.

Core entities include communities, categories, locations, tags, organizer roles, saved communities, profile preferences, listing views, join clicks, and moderation reports.

## Deployment checklist

- Apply every migration and confirm RLS is enabled on user-facing tables.
- Bootstrap the first administrator with a service-role/SQL-console insert into `public.user_roles`; never expose role assignment to browser clients.
- Configure email confirmation and the Google OAuth redirect URLs in Supabase Auth.
- Set production values for all variables in `.env.example`.
- Add the production domain to Supabase's allowed redirect URLs.
- Add final social artwork and favicon exports.
- Configure SPA rewrites so unknown routes serve `index.html`.
- Run typecheck, lint, and a production build in CI.
- Enable error monitoring, uptime checks, database backups, and rate limiting at the hosting edge.
- Review the privacy policy and terms with qualified counsel before launch.
- Perform a trademark and domain-availability review for the Nearloom name before public release.

## Product principles

- Useful before addictive: no infinite feed or engagement traps.
- Local without being invasive: city-level discovery, not exact user tracking.
- Trust is visible: verification, activity, rules, and join methods are explicit.
- Communities stay independent: Nearloom routes people to existing channels.
- Accessible by default: keyboard focus, reduced-motion support, semantic labels, and responsive layouts.
