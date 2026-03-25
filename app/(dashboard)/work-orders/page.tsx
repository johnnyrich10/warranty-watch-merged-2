import { WorkOrdersPageView } from '@/components/work-orders/work-orders-page-view';
import { db } from '@/lib/db';
import { requireAppUser } from '@/lib/current-user';

export default async function WorkOrdersPage() {
  const user = await requireAppUser();
  const where = user.role === 'VENDOR' ? { vendorId: user.vendorId ?? '' } : {};
  const workOrders = await db.workOrder.findMany({ where, include: { claim: { include: { home: { include: { homeowner: true } } } }, vendor: true }, orderBy: { createdAt: 'desc' } });
  const canCreate = ['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role);
  const vendors = canCreate ? await db.vendor.findMany({ orderBy: { name: 'asc' } }) : [];
  const claims = canCreate ? await db.claim.findMany({ orderBy: { claimNumber: 'asc' } }) : [];
  return <WorkOrdersPageView workOrders={workOrders} vendors={vendors} claims={claims} canCreate={canCreate} />;
}
