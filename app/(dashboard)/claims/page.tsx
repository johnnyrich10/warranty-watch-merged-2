import { ClaimsPageView } from '@/components/claims/claims-page-view';
import { db } from '@/lib/db';
import { requireAppUser } from '@/lib/current-user';

export default async function ClaimsPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const user = await requireAppUser();
  const sp = await searchParams;
  const q = sp?.q?.trim();
  const roleWhere = user.role === 'HOMEOWNER'
    ? { homeownerId: user.homeownerId ?? '' }
    : user.role === 'VENDOR'
      ? { OR: [{ vendorId: user.vendorId ?? '' }, { workOrders: { some: { vendorId: user.vendorId ?? '' } } }] }
      : {};
  const claims = await db.claim.findMany({
    where: {
      ...roleWhere,
      ...(q ? { OR: [
        { claimNumber: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { home: { address: { contains: q, mode: 'insensitive' } } },
        { home: { homeowner: { name: { contains: q, mode: 'insensitive' } } } },
      ] } : {}),
    },
    include: { home: { include: { homeowner: true, community: true } }, vendor: true },
    orderBy: { createdAt: 'desc' },
  });
  return <ClaimsPageView claims={claims} initialQuery={q ?? ''} />;
}
