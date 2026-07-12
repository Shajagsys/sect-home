/*
 * Seeds MOCK login accounts for trying out the platform (run: npm run db:seed-demo).
 * Idempotent — safe to re-run; existing accounts get their passwords reset to the
 * mock values below.
 *
 * ⚠ DEMO CREDENTIALS ONLY — change or delete these before going live.
 */
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const TEAM = [
  { name: 'Admin User', email: 'admin@secureedge.in', password: 'Admin@123', role: 'admin', phone: '+91 90000 00001' },
  { name: 'Priya Sharma', email: 'priya@secureedge.in', password: 'Sales@123', role: 'sales', phone: '+91 90000 00002' },
  { name: 'Arjun Nair', email: 'arjun@secureedge.in', password: 'Sales@123', role: 'sales', phone: '+91 90000 00003' },
];

const CLIENTS = [
  {
    name: 'Rohit Desai', company: 'Desai Industries Pvt Ltd', email: 'client1@example.com',
    phone: '+91 98888 77665', gstin: '27AABCD1234E1Z5', state: '27',
    address: 'Plot 12, MIDC, Pune, Maharashtra', code: 'Client@123', credit: 500000,
  },
  {
    name: 'Meera Iyer', company: 'Iyer Fintech Solutions', email: 'client2@example.com',
    phone: '+91 97777 66554', gstin: '29AAFCI9876K1Z3', state: '29',
    address: '4th Floor, MG Road, Bengaluru, Karnataka', code: 'Client@123', credit: 300000,
  },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set. Copy .env.example to .env and configure it.');
    process.exit(1);
  }
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    for (const u of TEAM) {
      const hash = await bcrypt.hash(u.password, 12);
      await client.query(
        `INSERT INTO users (name, email, password_hash, role, phone, active)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (email) DO UPDATE
           SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, active = true`,
        [u.name, u.email, hash, u.role, u.phone]
      );
      console.log(`Team login ready:   ${u.email} / ${u.password} (${u.role})`);
    }
    for (const c of CLIENTS) {
      const hash = await bcrypt.hash(c.code, 12);
      await client.query(
        `INSERT INTO clients (name, company, email, phone, gstin, address, state_code,
                              credit_limit, portal_code_hash, portal_enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
         ON CONFLICT (email) DO UPDATE
           SET portal_code_hash = EXCLUDED.portal_code_hash, portal_enabled = true`,
        [c.name, c.company, c.email, c.phone, c.gstin, c.address, c.state, c.credit, hash]
      );
      console.log(`Portal login ready: ${c.email} / ${c.code} (${c.company})`);
    }
    console.log('\nDone. ⚠ These are mock credentials — change them before production.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
