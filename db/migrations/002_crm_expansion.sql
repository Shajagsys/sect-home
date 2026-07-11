-- Upgrade existing databases created with the original schema.
-- Idempotent: safe to run repeatedly.

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS value NUMERIC(12,2) NOT NULL DEFAULT 0;

-- Widen the status check to include the negotiation stage.
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'qualified', 'proposal',
                    'negotiation', 'won', 'lost'));

CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);

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

CREATE TABLE IF NOT EXISTS proposals (
  id               SERIAL PRIMARY KEY,
  lead_id          INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  created_by       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  items            JSONB NOT NULL DEFAULT '[]',
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

CREATE TABLE IF NOT EXISTS webhook_keys (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  key          TEXT NOT NULL UNIQUE,
  source_label TEXT NOT NULL DEFAULT 'webhook',
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The old notes table was never exposed in the UI; the activity timeline
-- replaces it.
DROP TABLE IF EXISTS lead_notes;
