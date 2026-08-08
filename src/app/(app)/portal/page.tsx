import { redirect } from 'next/navigation';
import { getPortalSession } from '@/lib/auth';
import SiteHeader from '@/components/SiteHeader';
import PortalLoginForm from './PortalLoginForm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Client Portal | SecureEdge Cyber Technologies LLP' };

export default async function PortalLoginPage() {
  const session = await getPortalSession();
  if (session) redirect('/portal/home');

  return (
    <>
      <SiteHeader />
      <main className="auth-wrap">
        <div className="auth-card">
          <h1>Client Portal</h1>
          <p className="auth-sub">
            Sign in with your email and the access code shared by the SecureEdge team to view
            your invoices, projects, renewals and credit — and to raise new requests.
          </p>
          <PortalLoginForm />
        </div>
      </main>
    </>
  );
}
