/* Creates (or updates) the admin user from ADMIN_EMAIL / ADMIN_PASSWORD. */
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!databaseUrl || !email || !password) {
    console.error('DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD must be set.');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ('Administrator', $1, $2, 'admin')
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email.toLowerCase(), hash]
    );
    console.log(`Admin user ready: ${email}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
