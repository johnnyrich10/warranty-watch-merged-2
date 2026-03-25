"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SubmitClaimForm({ homes }: { homes: any[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [homeId, setHomeId] = useState(homes[0]?.id ?? '');
  const [category, setCategory] = useState('HVAC');
  const [priority, setPriority] = useState('Medium');
  const [preferredAccess, setPreferredAccess] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const response = await fetch('/api/claims', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ homeId, category, priority, preferredAccess, description }) });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) { setStatus(data?.message ?? 'Something went wrong.'); return; }
    setStatus(`Warranty claim ${data.claimNumber ?? data.claim?.claimNumber ?? ''} submitted.`);
    router.push('/claims');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <select value={homeId} onChange={(e) => setHomeId(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2">{homes.map((home) => <option key={home.id} value={home.id}>{home.address} — {home.homeowner?.name ?? 'No homeowner'} ({home.community.name})</option>)}</select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"><option>HVAC</option><option>Plumbing</option><option>Electrical</option><option>Drywall</option><option>Roofing</option><option>Exterior</option></select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"><option>Low</option><option>Medium</option><option>High</option></select>
      </div>
      <input value={preferredAccess} onChange={(e) => setPreferredAccess(e.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Preferred access window" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-4 min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Describe the issue..." />
      <button disabled={saving} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? 'Submitting...' : 'Submit Claim'}</button>
      {status ? <p className="mt-3 text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
