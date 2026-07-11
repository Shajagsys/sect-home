-- SecureEdge Cyber Technologies LLP - CRM & Lead Generation schema
-- Fresh installs get the full schema here. Existing databases are upgraded by
-- the files in db/migrations/, which `npm run db:init` also applies.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'sales' CHECK (role IN ('admin', 'sales')),
  phone         TEXT,
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leads (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  company       TEXT,
  interest      TEXT,          -- product/service the lead is interested in
  message       TEXT,
  source        TEXT NOT NULL DEFAULT 'website',
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  value         NUMERIC(12,2) NOT NULL DEFAULT 0,  -- estimated deal value
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'contacted', 'qualified', 'proposal',
                                  'negotiation', 'won', 'lost')),
  assigned_to   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);

-- Unified activity timeline per lead: notes, stage changes, assignments, etc.
CREATE TABLE IF NOT EXISTS lead_activities (
  id         SERIAL PRIMARY KEY,
  lead_id    INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  type       TEXT NOT NULL CHECK (type IN ('created', 'note', 'status_change',
                                           'assignment', 'proposal', 'value_change')),
  detail     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_lead ON lead_activities(lead_id, created_at DESC);

-- Quotations/proposals created for a lead.
CREATE TABLE IF NOT EXISTS proposals (
  id               SERIAL PRIMARY KEY,
  lead_id          INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  items            JSONB NOT NULL DEFAULT '[]',  -- [{description, qty, unit_price}]
  tax_percent      NUMERIC(5,2) NOT NULL DEFAULT 18,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  total            NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes            TEXT,
  valid_until      DATE,
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proposals_lead ON proposals(lead_id);

-- API keys for inbound lead-collection webhooks (Meta/LinkedIn forms via
-- Zapier/Make, landing pages, chatbots, etc.).
CREATE TABLE IF NOT EXISTS webhook_keys (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  key          TEXT NOT NULL UNIQUE,
  source_label TEXT NOT NULL DEFAULT 'webhook',  -- default lead source for this key
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
