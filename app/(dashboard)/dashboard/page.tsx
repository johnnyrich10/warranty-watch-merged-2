import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/current-user';

export default async function DashboardPage() {
  await requireRole(['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT']);
  const claims = await db.claim.findMany({ include: { home: { include: { homeowner: true, community: true } }, vendor: true }, orderBy: { createdAt: 'desc' }, take: 10 });
  const openClaimsCount = await db.claim.count({ where: { status: { not: 'Closed' } } });
  const vendorCount = await db.vendor.count();
  const homeownerCount = await db.homeowner.count();
  const workOrderCount = await db.workOrder.count();
  return <DashboardOverview stats={{ openClaimsCount, vendorCount, homeownerCount, workOrderCount }} claims={claims} />;
}
