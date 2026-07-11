import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import DashHeader from '@/components/DashHeader';
import UsersClient, { UserRow } from './UsersClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Team | SecureEdge CRM',
};

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard/users');
  if (session.role !== 'admin') redirect('/dashboard');

  const result = await query<UserRow>(
    `SELECT id, name, email, role, phone, active, created_at::text AS created_at
     FROM users ORDER BY name`
  );

  return (
    <>
      <DashHeader session={session} />
      <main className="section">
        <div className="container">
          <div className="dash-header">
            <h1>Team Management</h1>
          </div>
          <UsersClient initialUsers={result.rows} selfId={Number(session.sub)} />
        </div>
      </main>
    </>
  );
}
