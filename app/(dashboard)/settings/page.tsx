import { SettingsPageView } from '@/components/settings/settings-page-view';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/current-user';

export default async function SettingsPage() {
  await requireRole(['BUILDER_ADMIN']);
  const communities = await db.community.findMany({ orderBy: { name: 'asc' } });
  return <SettingsPageView communities={communities} />;
}
