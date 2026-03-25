import { VendorsPageView } from '@/components/vendors/vendors-page-view';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/current-user';

export default async function VendorsPage() {
  await requireRole(['BUILDER_ADMIN', 'COORDINATOR']);
  const vendors = await db.vendor.findMany({ include: { workOrders: true, claims: true }, orderBy: { name: 'asc' } });
  return <VendorsPageView vendors={vendors} />;
}
