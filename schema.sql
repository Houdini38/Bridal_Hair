-- Leads captured by the byhoward.com site forms.
-- Apply with: npx wrangler d1 execute byhoward-leads --remote --file=./schema.sql
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form TEXT NOT NULL,            -- which form: 'lead-form' | 'growth-audit-form'
  name TEXT,
  email TEXT,
  payload TEXT NOT NULL,         -- full submission as JSON
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
