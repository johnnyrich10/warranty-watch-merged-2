import { ReportsPageView } from '@/components/reports/reports-page-view';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/current-user';

export default async function ReportsPage() {
  await requireRole(['BUILDER_ADMIN', 'COORDINATOR']);
  const claims = await db.claim.findMany({ include: { vendor: true } });
  return <ReportsPageView claims={claims} />;
}
