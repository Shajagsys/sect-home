#!/usr/bin/env bash
#
# One-command local database setup for the SecureEdge CRM.
#
#   bash scripts/setup-local-db.sh
#
# What it does:
#   1. Creates the PostgreSQL database (default: secureedge_crm) if missing
#   2. Writes .env with DATABASE_URL and a random AUTH_SECRET (won't overwrite)
#   3. Installs npm dependencies if needed
#   4. Applies the schema + migrations   (npm run db:init)
#   5. Seeds the mock logins            (npm run db:seed-demo)
#
# Override defaults via environment variables, e.g.:
#   DB_USER=myuser DB_PASSWORD=mypass bash scripts/setup-local-db.sh
set -euo pipefail

DB_NAME="${DB_NAME:-secureedge_crm}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

cd "$(dirname "$0")/.."

echo "==> Checking PostgreSQL client..."
if ! command -v psql >/dev/null 2>&1; then
  echo "ERROR: psql not found. Install PostgreSQL first:"
  echo "  Ubuntu/Debian: sudo apt install postgresql postgresql-client"
  echo "  macOS:         brew install postgresql@16 && brew services start postgresql@16"
  echo "  Windows:       https://www.postgresql.org/download/windows/"
  exit 1
fi

export PGPASSWORD="$DB_PASSWORD"
PSQL=(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER")

echo "==> Checking connection to PostgreSQL at $DB_HOST:$DB_PORT as $DB_USER..."
if ! "${PSQL[@]}" -d postgres -c 'SELECT 1' >/dev/null 2>&1; then
  echo "ERROR: Could not connect. Is PostgreSQL running, and are DB_USER/DB_PASSWORD correct?"
  echo "  Start it: sudo service postgresql start   (Linux)"
  echo "            brew services start postgresql  (macOS)"
  exit 1
fi

echo "==> Creating database '$DB_NAME' (if it doesn't exist)..."
if "${PSQL[@]}" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
  echo "    Database already exists — keeping it."
else
  "${PSQL[@]}" -d postgres -c "CREATE DATABASE \"$DB_NAME\""
  echo "    Created."
fi

DATABASE_URL="postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

echo "==> Writing .env (kept as-is if it already exists)..."
if [ -f .env ]; then
  echo "    .env already exists — not touching it. Make sure DATABASE_URL points at $DB_NAME."
else
  AUTH_SECRET="$(node "$(dirname "$0")/gen-secret.js")"
  {
    echo "DATABASE_URL=$DATABASE_URL"
    echo "AUTH_SECRET=$AUTH_SECRET"
    echo "APP_URL=http://localhost:3000"
  } > .env
  echo "    Created .env with DATABASE_URL and a random AUTH_SECRET."
fi

if [ ! -d node_modules ]; then
  echo "==> Installing npm dependencies..."
  npm install
fi

echo "==> Applying schema and migrations..."
DATABASE_URL="$DATABASE_URL" npm run db:init

echo "==> Seeding mock logins..."
DATABASE_URL="$DATABASE_URL" npm run db:seed-demo

cat <<'DONE'

============================================================
 Local database is ready. Start the app with:  npm run dev
 Then open http://localhost:3000

 CRM logins (/login):
   admin@secureedge.in  / Admin@123   (admin)
   priya@secureedge.in  / Sales@123   (sales)
   arjun@secureedge.in  / Sales@123   (sales)

 Client portal logins (/portal):
   client1@example.com  / Client@123  (Desai Industries - Maharashtra)
   client2@example.com  / Client@123  (Iyer Fintech - Karnataka)

 NOTE: mock credentials only - change them before production.
============================================================
DONE
