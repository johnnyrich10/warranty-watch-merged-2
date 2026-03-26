import { notFound } from 'next/navigation';
import { ClaimDetailView } from '@/components/claims/claim-detail-view';
import { db } from '@/lib/db';
import { requireAppUser } from '@/lib/current-user';

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAppUser();
  const claim = await db.claim.findUnique({
    where: { id },
    include: {
      home: { include: { homeowner: true, community: true } },
      vendor: true,
      workOrders: { include: { vendor: true }, orderBy: { createdAt: 'desc' } },
      statusHistory: { orderBy: { createdAt: 'asc' } },
      notes: { orderBy: { createdAt: 'desc' } },
      attachments: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!claim) notFound();
  const allowed = ['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role) || (user.role === 'HOMEOWNER' && claim.homeownerId === user.homeownerId) || (user.role === 'VENDOR' && (claim.vendorId === user.vendorId || claim.workOrders.some((wo: any) => wo.vendorId === user.vendorId)));
  if (!allowed) notFound();
  return <ClaimDetailView claim={claim} user={user} />;
}
