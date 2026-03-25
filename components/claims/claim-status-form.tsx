"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ClaimStatusForm({ claimId, currentStatus, currentPriority, vendorId, vendors }: { claimId: string; currentStatus: string; currentPriority: string; vendorId: string | null; vendors: { id: string; name: string }[] }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [priority, setPriority] = useState(currentPriority);
  const [selectedVendorId, setSelectedVendorId] = useState(vendorId ?? '');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/claims/${claimId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, priority, vendorId: selectedVendorId || null, note }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
        {['New','Under Review','Inspection Scheduled','Assigned','In Progress','Waiting on Parts','Completed','Closed'].map((s) => <option key={s}>{s}</option>)}
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
        {['Low','Medium','High'].map((s) => <option key={s}>{s}</option>)}
      </select>
      <select value={selectedVendorId} onChange={(e) => setSelectedVendorId(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
        <option value="">Unassigned</option>
        {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
      </select>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="Internal note or status note..." />
      <button disabled={saving} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save Claim Update'}</button>
    </form>
  );
}
