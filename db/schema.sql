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

-- ===================== Client management =====================

CREATE TABLE IF NOT EXISTS clients (
  id               SERIAL PRIMARY KEY,
  name             TEXT NOT NULL,           -- primary contact person
  company          TEXT,
  email            TEXT NOT NULL UNIQUE,
  phone            TEXT,
  gstin            TEXT,
  address          TEXT,
  state_code       TEXT NOT NULL DEFAULT '29',  -- GST state code (place of supply)
  credit_limit     NUMERIC(12,2) NOT NULL DEFAULT 0,
  portal_code_hash TEXT,                    -- bcrypt hash of the portal access code
  portal_enabled   BOOLEAN NOT NULL DEFAULT false,
  lead_id          INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Double-entry style client ledger: debit = client owes us, credit = client paid.
CREATE TABLE IF NOT EXISTS ledger_entries (
  id          SERIAL PRIMARY KEY,
  client_id   INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  entry_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  type        TEXT NOT NULL CHECK (type IN ('invoice', 'payment', 'credit_note', 'adjustment')),
  description TEXT NOT NULL,
  debit       NUMERIC(12,2) NOT NULL DEFAULT 0,
  credit      NUMERIC(12,2) NOT NULL DEFAULT 0,
  ref_id      INTEGER,                      -- invoice/payment id this entry mirrors
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ledger_client ON ledger_entries(client_id, entry_date);

-- Team ↔ client conversation threads (dashboard and client portal).
CREATE TABLE IF NOT EXISTS client_messages (
  id         SERIAL PRIMARY KEY,
  client_id  INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sender     TEXT NOT NULL CHECK (sender IN ('team', 'client')),
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_client ON client_messages(client_id, created_at);

-- Requests raised by clients from the portal (new projects, renewals, support).
CREATE TABLE IF NOT EXISTS project_requests (
  id         SERIAL PRIMARY KEY,
  client_id  INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id INTEGER,
  type       TEXT NOT NULL DEFAULT 'new_project'
             CHECK (type IN ('new_project', 'renewal', 'support', 'other')),
  title      TEXT NOT NULL,
  details    TEXT,
  status     TEXT NOT NULL DEFAULT 'new'
             CHECK (status IN ('new', 'reviewing', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===================== Projects & contracts =====================

CREATE TABLE IF NOT EXISTS projects (
  id           SERIAL PRIMARY KEY,
  client_id    INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_id      INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  description  TEXT,
  value        NUMERIC(12,2) NOT NULL DEFAULT 0,
  start_date   DATE,
  end_date     DATE,
  renewal_date DATE,
  status       TEXT NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'contract_sent', 'signed', 'active',
                                 'completed', 'renewed', 'closed')),
  signer_name  TEXT,                        -- client-side authorised signatory
  signer_email TEXT,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);

CREATE TABLE IF NOT EXISTS contracts (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,               -- contract terms shown to the signer
  status       TEXT NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'sent', 'signed', 'declined')),
  signer_name  TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  sign_token   TEXT NOT NULL UNIQUE,        -- public e-sign link token
  sent_at      TIMESTAMPTZ,
  signed_at    TIMESTAMPTZ,
  signed_name  TEXT,                        -- typed e-signature
  signed_ip    TEXT,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===================== Accounts (Indian GST) =====================

-- Sales (outward) tax invoices. Items: [{description, hsn_sac, qty, unit_price, gst_rate}]
CREATE TABLE IF NOT EXISTS invoices (
  id             SERIAL PRIMARY KEY,
  number         TEXT NOT NULL UNIQUE,      -- e.g. INV-2026-27-00042 (FY series)
  client_id      INTEGER NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  project_id     INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  issue_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date       DATE,
  items          JSONB NOT NULL DEFAULT '[]',
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  place_of_supply TEXT NOT NULL,            -- client GST state code at invoice time
  inter_state    BOOLEAN NOT NULL DEFAULT false,
  taxable        NUMERIC(12,2) NOT NULL DEFAULT 0,
  cgst           NUMERIC(12,2) NOT NULL DEFAULT 0,
  sgst           NUMERIC(12,2) NOT NULL DEFAULT 0,
  igst           NUMERIC(12,2) NOT NULL DEFAULT 0,
  total          NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid    NUMERIC(12,2) NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled')),
  notes          TEXT,
  created_by     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(issue_date);

CREATE TABLE IF NOT EXISTS invoice_payments (
  id         SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount     NUMERIC(12,2) NOT NULL,
  method     TEXT NOT NULL DEFAULT 'bank_transfer',
  reference  TEXT,
  paid_on    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Purchase requests/orders: lifecycle requested → approved → ordered → received → billed.
CREATE TABLE IF NOT EXISTS purchase_orders (
  id            SERIAL PRIMARY KEY,
  number        TEXT NOT NULL UNIQUE,       -- PO-2026-27-00007
  vendor_name   TEXT NOT NULL,
  vendor_gstin  TEXT,
  vendor_email  TEXT,
  project_id    INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  items         JSONB NOT NULL DEFAULT '[]',
  inter_state   BOOLEAN NOT NULL DEFAULT false,
  taxable       NUMERIC(12,2) NOT NULL DEFAULT 0,
  cgst          NUMERIC(12,2) NOT NULL DEFAULT 0,
  sgst          NUMERIC(12,2) NOT NULL DEFAULT 0,
  igst          NUMERIC(12,2) NOT NULL DEFAULT 0,
  total         NUMERIC(12,2) NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'requested'
                CHECK (status IN ('requested', 'approved', 'ordered', 'received',
                                  'billed', 'cancelled')),
  expected_date DATE,
  notes         TEXT,
  created_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vendor bills (GST inward / input tax credit).
CREATE TABLE IF NOT EXISTS purchase_invoices (
  id           SERIAL PRIMARY KEY,
  bill_number  TEXT NOT NULL,               -- vendor's invoice number
  vendor_name  TEXT NOT NULL,
  vendor_gstin TEXT,
  po_id        INTEGER REFERENCES purchase_orders(id) ON DELETE SET NULL,
  project_id   INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  bill_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  taxable      NUMERIC(12,2) NOT NULL DEFAULT 0,
  cgst         NUMERIC(12,2) NOT NULL DEFAULT 0,
  sgst         NUMERIC(12,2) NOT NULL DEFAULT 0,
  igst         NUMERIC(12,2) NOT NULL DEFAULT 0,
  total        NUMERIC(12,2) NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'unpaid'
               CHECK (status IN ('unpaid', 'paid', 'cancelled')),
  paid_on      DATE,
  notes        TEXT,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_purchase_invoices_date ON purchase_invoices(bill_date);
