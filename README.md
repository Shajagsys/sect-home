# SecureEdge Cyber Technologies LLP — CRM & Lead Generation Platform

Company website + CRM for **SecureEdge Cyber Technologies LLP** — IT, Cyber Security and
Digital Information Security services, plus sales & support for renowned security products
(Mimecast, Incydr, SOCRadar, Druva inSync, Beam and more).

## Features

### Website & lead generation
- **Home page** with company profile, services, product catalogue and a **Login link on the
  right side of the header** (plus a "CRM Login" button in the hero and a footer link).
- **Lead capture form** ("Get a Quote / Request a Demo") that saves every enquiry into
  PostgreSQL, with **UTM campaign attribution** (`?utm_source=linkedin&utm_campaign=...`
  traffic is tagged with its social channel automatically).
- **Social media links** in the footer (configurable via `NEXT_PUBLIC_SOCIAL_*` env vars).
- **Inbound webhook API** (`POST /api/webhooks/leads`, per-channel API keys) to collect
  leads from Facebook/Instagram Lead Ads, LinkedIn Lead Gen Forms, Google Ads, landing
  pages and chatbots — directly or via Zapier / Make / n8n.
- **Email notifications** to your team on every new lead (SMTP via nodemailer, optional).

### CRM
- **Leads dashboard** with pipeline stats, **search and filters** (text, stage, source,
  assignee), inline stage changes and **lead assignment to team members**.
- **Click-to-call** (`tel:`) and **click-to-WhatsApp** (`wa.me` with a prefilled message)
  from the leads table and the lead detail page.
- **Lead detail page** with the full **end-to-end lifecycle** (new → contacted → qualified
  → proposal → negotiation → won/lost), a visual stage track, estimated deal value, and a
  **notes & activity timeline** that auto-logs every stage change, assignment, value change
  and proposal event.
- **Proposal creator**: line-item quotations with GST/discount and INR totals, a printable
  proposal document (Print / Save as PDF), and a status flow (draft → sent →
  accepted/rejected) that advances the lead automatically — accepting a proposal wins the
  lead.
- **Reports & analytics**: win rate, open pipeline value, won value, pipeline funnel,
  leads by source, leads per month, and top interests.
- **Team management (admin)**: add members, set roles (admin/sales), enable/disable
  accounts, reset passwords.
- **Webhook key management (admin)**: generate/disable per-channel API keys with copyable
  integration instructions.
- **Authentication**: email + password login (bcrypt-hashed passwords, signed HTTP-only
  session cookie), role-based access, middleware protecting the dashboard.

### Client Management
- **Client register** with GSTIN, GST state (place of supply), billing address and credit
  limit; won leads convert to clients in one call.
- **Client ledger**: every invoice (debit) and payment (credit) posts automatically;
  outstanding / credit balance is always current.
- **Client score** (0–100) computed from payment behaviour, overdue invoices, lifetime
  revenue and recent activity, with Excellent / Good / At Risk / Critical bands.
- **Client conversations**: two-way message threads between the team (dashboard) and the
  client (portal).
- **Client portal** (`/portal`): clients sign in with email + access code to see their
  invoices (view & print), projects and renewal dates, credit balance and limit, raise
  project / renewal / support requests, and chat with the team.

### Projects & Contract Workflow
- **Projects** linked to clients (and back to the originating lead), with value, dates,
  renewal date and a named **project signer** (client-side authorised signatory).
- **Contract e-sign workflow**: draft terms (template pre-filled), send a tokenised public
  signing link, the signer reviews and signs by typing their name (timestamp + IP
  recorded), or declines.
- **Invoice on signature**: once signed, one click generates a company-branded GST tax
  invoice from the project value and posts it to the client ledger. Invoicing is blocked
  until the contract is signed.

### Accounts (Indian GST compliant)
- **Tax invoices**: FY-series numbering (INV-2026-27-…), HSN/SAC per line, automatic
  CGST+SGST vs IGST based on place of supply, discount, amount in words (lakh/crore),
  bank details and authorised-signatory block, printable with company branding.
- **Payments & receivables**: record part/full payments (UTR reference), automatic
  partial/paid status and ledger credits; cancellation raises a credit note.
- **Purchases**: purchase requests → admin approval → ordered → received → billed
  lifecycle, plus **purchase invoices** (vendor bills) capturing input tax credit,
  attributable to projects for costing.
- **GST reports**: outward (sales) and inward (ITC) registers for any date range with
  document-level detail and **net GST payable**.
- **Finance analytics**: P&L (revenue vs expenses, ex-GST) weekly / monthly / quarterly /
  custom dates, margin, cash collected, GST position, and **per-project / per-lead
  profitability** with margins.

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
