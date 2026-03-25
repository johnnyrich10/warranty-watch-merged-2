import { HomeownersPageView } from '@/components/homeowners/homeowners-page-view';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/current-user';

export default async function HomeownersPage() {
  await requireRole(['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT']);
  const homeowners = await db.homeowner.findMany({ include: { homes: { include: { community: true } }, claims: true }, orderBy: { name: 'asc' } });
  return <HomeownersPageView homeowners={homeowners} />;
}
