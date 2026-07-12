'use client';

import { useState } from 'react';

export interface ChatMessage {
  id: number;
  sender: string; // 'team' | 'client'
  author: string | null;
  body: string;
  created_at: string;
}

/**
 * Shared conversation thread. `viewer` controls which side the bubbles align
 * to and which API endpoint receives new messages.
 */
export default function ChatThread({
  initialMessages,
  viewer,
  postUrl,
}: {
  initialMessages: ChatMessage[];
  viewer: 'team' | 'client';
  postUrl: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to send');
      setMessages((current) => [...current, body.message]);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="chat-thread">
        {messages.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No messages yet — start the conversation.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.sender === viewer ? 'mine' : 'theirs'}`}>
            <p className="chat-body">{m.body}</p>
            <p className="chat-meta">
              {m.author || (m.sender === 'team' ? 'SecureEdge Team' : 'Client')} ·{' '}
              {new Date(m.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={send} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          maxLength={4000}
          style={{
            flex: 1, padding: '10px 12px', border: '1px solid var(--border)',
            borderRadius: 6, fontSize: 14.5, fontFamily: 'inherit',
          }}
        />
        <button className="btn btn-primary btn-sm" type="submit" disabled={sending || !text.trim()}>
          Send
        </button>
      </form>
      {error && <p className="form-msg error">{error}</p>}
    </div>
  );
}
