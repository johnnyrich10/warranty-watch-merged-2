import { Card } from '@/components/ui/card';
import { formatClaim } from '@/lib/formatters';
import { ClaimStatusForm } from '@/components/claims/claim-status-form';
import { ClaimPhotoUploader } from '@/components/claims/claim-photo-uploader';
import { ClaimAttachmentGallery } from '@/components/claims/claim-attachment-gallery';
import { db } from '@/lib/db';

export async function ClaimDetailView({ claim, user }: { claim: any; user: any }) {
  const c = formatClaim(claim);
  const vendors = ['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role)
    ? await db.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })
    : [];
  const canManage = ['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role);
  const canDeleteAttachments = ['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role) || (user.role === 'HOMEOWNER' && claim.homeownerId === user.homeownerId);

  return (
    <div className="grid gap-6 px-5 py-6 sm:px-8 xl:grid-cols-[1.5fr_1fr]">
      <Card className="p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">{c.claimNumber}</p>
            <h3 className="mt-1 text-2xl font-bold">{c.category} warranty issue</h3>
            <p className="mt-2 text-sm text-slate-500">{c.homeownerName} • {c.address} • {c.communityName}</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            <div>Status: <span className="font-medium text-slate-900">{c.status}</span></div>
            <div>Priority: <span className="font-medium text-slate-900">{c.priority}</span></div>
          </div>
        </div>
        <div className="grid gap-6 pt-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Issue Summary</h4>
            <p className="mt-3 text-sm leading-6 text-slate-700">{c.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Coverage Snapshot</h4>
            <div className="mt-3 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Home close date</span><span className="font-medium">{c.closeDate ?? '—'}</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Trade</span><span className="font-medium">{c.category}</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Preferred access</span><span className="font-medium">{c.preferredAccess ?? '—'}</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Assigned vendor</span><span className="font-medium">{c.vendorName ?? 'Unassigned'}</span></div>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Activity Timeline</h4>
          <div className="mt-4 space-y-4">
            {claim.statusHistory.map((item: any) => (
              <div key={item.id} className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900" />
                <div>
                  <div className="text-sm font-medium text-slate-800">{item.status}</div>
                  <div className="text-xs text-slate-500">{item.note ?? 'No note'} • {new Date(item.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div className="space-y-6">
        {canManage ? <Card className="p-5"><h4 className="text-lg font-semibold">Update Claim</h4><div className="mt-4"><ClaimStatusForm claimId={claim.id} currentStatus={claim.status} currentPriority={claim.priority} vendorId={claim.vendorId} vendors={vendors} /></div></Card> : null}
        <Card className="p-5">
          <h4 className="text-lg font-semibold">Photos</h4>
          <div className="mt-4"><ClaimPhotoUploader claimId={claim.id} /></div>
          <div className="mt-4"><ClaimAttachmentGallery attachments={claim.attachments} canDelete={canDeleteAttachments} /></div>
        </Card>
        <Card className="p-5">
          <h4 className="text-lg font-semibold">Notes</h4>
          <div className="mt-4 space-y-3">
            {claim.notes.length === 0 ? <p className="text-sm text-slate-500">No notes yet.</p> : claim.notes.map((note: any) => <div key={note.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><div>{note.body}</div><div className="mt-2 text-xs text-slate-500">{new Date(note.createdAt).toLocaleString()}</div></div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
