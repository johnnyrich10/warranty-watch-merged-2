"use client";

import { useRouter } from 'next/navigation';

export function ClaimAttachmentGallery({ attachments, canDelete }: { attachments: any[]; canDelete: boolean }) {
  const router = useRouter();

  async function removeAttachment(id: string) {
    const res = await fetch(`/api/attachments/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {attachments.map((file) => (
        <div key={file.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <a href={file.url} target="_blank" rel="noreferrer">
            <img src={file.url} alt={file.fileName ?? 'Claim photo'} className="h-32 w-full object-cover" />
          </a>
          {canDelete ? <button onClick={() => removeAttachment(file.id)} className="w-full border-t border-slate-200 px-3 py-2 text-sm text-slate-700">Delete</button> : null}
        </div>
      ))}
    </div>
  );
}
