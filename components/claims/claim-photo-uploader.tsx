"use client";

import { useRouter } from 'next/navigation';
import { UploadButton } from '@/lib/uploadthing';

export function ClaimPhotoUploader({ claimId }: { claimId: string }) {
  const router = useRouter();
  return (
    <div className="space-y-3">
      <UploadButton
        endpoint="claimImage"
        input={{ claimId }}
        onClientUploadComplete={() => router.refresh()}
        onUploadError={(error: Error) => alert(error.message || 'Upload failed')}
      />
      <p className="text-xs text-slate-500">Upload photos for this warranty issue.</p>
    </div>
  );
}
