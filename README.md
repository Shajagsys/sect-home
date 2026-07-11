# SecureEdge Cyber Technologies LLP — CRM & Lead Generation Platform

Company website + CRM for **SecureEdge Cyber Technologies LLP** — IT, Cyber Security and
Digital Information Security services, plus sales & support for renowned security products
(Mimecast, Incydr, SOCRadar, Druva inSync, Beam and more).

## Features

- **Home page** with company profile, services, product catalogue and a **Login link on the
  right side of the header** (plus a "CRM Login" button in the hero and a footer link).
- **Lead generation**: the "Get a Quote / Request a Demo" form on the home page saves every
  enquiry directly into PostgreSQL as a lead.
- **CRM dashboard** (`/dashboard`): pipeline stats and a leads table with inline status
  updates (new → contacted → qualified → proposal → won/lost).
- **Authentication**: email + password login (bcrypt-hashed passwords, signed HTTP-only
  session cookie), with middleware protecting the dashboard.

## Tech stack

- **Next.js 14** (App Router, React 18, TypeScript) — frontend + Node.js API routes
- **PostgreSQL** via `pg`
- `bcryptjs` for password hashing, `jose` for session tokens

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # edit .env: set DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
   ```

3. **Create the database and apply the schema**

   ```bash
   createdb secureedge_crm        # or create it via your Postgres tool of choice
   npm run db:init
   ```

4. **Seed the admin user**

   ```bash
   npm run db:seed
   ```

5. **Run the app**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 — use the **Login** link at the top-right to sign in with the
   admin credentials from `.env`, and you'll land on the CRM dashboard.

## Project structure

```
db/schema.sql                     # PostgreSQL schema (users, leads, lead_notes)
scripts/init-db.js                # applies the schema (npm run db:init)
scripts/seed-admin.js             # creates the admin user (npm run db:seed)
src/app/page.tsx                  # home page (header has the Login link on the right)
src/app/login/                    # login page
src/app/dashboard/                # CRM leads dashboard (auth-protected)
src/app/api/auth/login/route.ts   # POST: sign in
src/app/api/auth/logout/route.ts  # POST: sign out
src/app/api/leads/route.ts        # POST: public lead capture · GET: list leads (auth)
src/app/api/leads/[id]/route.ts   # PATCH: update lead status (auth)
src/lib/db.ts                     # pg connection pool
src/lib/auth.ts                   # session token helpers
src/middleware.ts                 # protects /dashboard
```
