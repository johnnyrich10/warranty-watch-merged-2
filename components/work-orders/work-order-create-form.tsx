"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function WorkOrderCreateForm({ vendors, claims }: { vendors: any[]; claims: any[] }) {
  const router = useRouter();
  const [claimId, setClaimId] = useState(claims[0]?.id ?? '');
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? '');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/work-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ claimId, vendorId, scheduledAt, notes, status: 'Assigned' }) });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <select value={claimId} onChange={(e) => setClaimId(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
        {claims.map((claim) => <option key={claim.id} value={claim.id}>{claim.claimNumber}</option>)}
      </select>
      <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
        {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
      </select>
      <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Instructions for technician..." />
      <button disabled={saving} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? 'Creating...' : 'Create Work Order'}</button>
    </form>
  );
}
