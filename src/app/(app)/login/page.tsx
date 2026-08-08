import { Suspense } from 'react';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login | SecureEdge Cyber Technologies LLP',
};

export default function LoginPage() {
  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <h1>CRM Login</h1>
        <p className="auth-sub">
          Sign in to the SecureEdge CRM &amp; Lead Generation platform.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
