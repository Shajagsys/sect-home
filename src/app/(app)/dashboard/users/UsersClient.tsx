'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  active: boolean;
  created_at: string;
}

export default function UsersClient({
  initialUsers,
  selfId,
}: {
  initialUsers: UserRow[];
  selfId: number;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  async function patchUser(id: number, patch: Record<string, unknown>) {
    setError('');
    setMessage('');
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Failed to update user');
      setUsers((current) =>
        current.map((u) => (u.id === id ? ({ ...u, ...patch } as UserRow) : u))
      );
      if ('password' in patch) setMessage('Password updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  }

  function resetPassword(id: number, name: string) {
    const password = window.prompt(`New password for ${name} (min 8 characters):`);
    if (!password) return;
    patchUser(id, { password });
  }

  async function createUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setCreating(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to create user');
      form.reset();
      setMessage('Team member added.');
      router.refresh();
      // Optimistically append so the table updates without waiting for refresh.
      setUsers((current) =>
        [
          ...current,
          {
            id: body.id,
            name: String(data.name),
            email: String(data.email).toLowerCase(),
            role: data.role === 'admin' ? 'admin' : 'sales',
            phone: String(data.phone || '') || null,
            active: true,
            created_at: new Date().toISOString(),
          },
        ].sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
      <div className="table-wrap">
        <table className="leads" style={{ minWidth: 640 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ opacity: user.active ? 1 : 0.55 }}>
                <td>
                  <strong>{user.name}</strong>
                  {user.id === selfId && (
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}> (you)</span>
                  )}
                  {user.phone && (
                    <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{user.phone}</div>
                  )}
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    className="status-select"
                    value={user.role}
                    disabled={user.id === selfId}
                    onChange={(e) => patchUser(user.id, { role: e.target.value })}
                    aria-label={`Role for ${user.name}`}
                  >
                    <option value="sales">Sales</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-pill ${user.active ? 'status-won' : 'status-lost'}`}>
                    {user.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => resetPassword(user.id, user.name)}
                  >
                    Reset password
                  </button>{' '}
                  {user.id !== selfId && (
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => patchUser(user.id, { active: !user.active })}
                    >
                      {user.active ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form className="form-card" onSubmit={createUser}>
        <h3 style={{ color: 'var(--navy)', marginBottom: 14 }}>Add team member</h3>
        <div className="form-field" style={{ marginBottom: 12 }}>
          <label htmlFor="u-name">Full name *</label>
          <input id="u-name" name="name" type="text" required maxLength={120} />
        </div>
        <div className="form-field" style={{ marginBottom: 12 }}>
          <label htmlFor="u-email">Email *</label>
          <input id="u-email" name="email" type="email" required maxLength={200} />
        </div>
        <div className="form-field" style={{ marginBottom: 12 }}>
          <label htmlFor="u-phone">Phone</label>
          <input id="u-phone" name="phone" type="tel" maxLength={30} />
        </div>
        <div className="form-field" style={{ marginBottom: 12 }}>
          <label htmlFor="u-password">Password * (min 8 chars)</label>
          <input id="u-password" name="password" type="password" required minLength={8} />
        </div>
        <div className="form-field" style={{ marginBottom: 16 }}>
          <label htmlFor="u-role">Role</label>
          <select id="u-role" name="role" defaultValue="sales">
            <option value="sales">Sales</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit" disabled={creating}>
          {creating ? 'Adding…' : 'Add Member'}
        </button>
        {error && <p className="form-msg error">{error}</p>}
        {message && <p className="form-msg success">{message}</p>}
      </form>
    </div>
  );
}
