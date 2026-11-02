# ManjitRana Global News

An independent, international news publishing platform built with Next.js and Supabase PostgreSQL.

## Current implementation
- Editorial-style responsive homepage with no fabricated/sample stories.
- Server-side article reads from Supabase.
- Initial PostgreSQL schema for articles, sources, countries, categories, events, revisions, media, jobs, logs and settings.
- Authenticated RSS/Atom discovery endpoint. Collected items remain unpublished until verification and editorial processing.
- Vercel Cron configuration for periodic feed discovery.

## Required environment variables
Set these in Vercel Project Settings → Environment Variables (never commit values):
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service-role key; server-only, never prefix with NEXT_PUBLIC.
- `CRON_SECRET`: long random secret used to authorize scheduled discovery.

## Database setup
1. Create a Supabase project using PostgreSQL.
2. Open SQL Editor and run `supabase/migrations/202610300001_initial_newsroom.sql`.
3. Add licensed RSS/Atom sources to `public.sources`. Record publisher terms and image permissions in `license_notes`.
4. Configure the environment variables above in Vercel.

## Discovery
Vercel Cron calls `/api/cron/discover` once per day (UTC) on the Hobby plan and sends the configured `CRON_SECRET` as a bearer token. The endpoint only collects feed metadata and links; every discovery stays unpublished until an editor independently verifies the reporting and publishes it from the newsroom.

## Editorial safeguards
RSS metadata is a lead, not a verified article. The scheduled job never auto-publishes. Editors must open and check the original reports, compare independent publishers, and publish from the private newsroom. Exact-title matches alone are not sufficient verification. Image rights and credits must be checked before adding a cover image.

## Local development
Node.js 22.13+:
```bash
npm install
npm run dev
```
