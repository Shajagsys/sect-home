/* Applies db/schema.sql plus db/migrations/*.sql (in order) to DATABASE_URL. */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set. Copy .env.example to .env and configure it.');
    process.exit(1);
  }
  const dbDir = path.join(__dirname, '..', 'db');
  const migrationsDir = path.join(dbDir, 'migrations');
  const files = [path.join(dbDir, 'schema.sql')];
  if (fs.existsSync(migrationsDir)) {
    for (const f of fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()) {
      files.push(path.join(migrationsDir, f));
    }
  }
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    for (const file of files) {
      await client.query(fs.readFileSync(file, 'utf8'));
      console.log(`Applied ${path.basename(file)}`);
    }
    console.log('Schema up to date.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
