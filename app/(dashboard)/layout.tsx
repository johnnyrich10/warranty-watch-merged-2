import { AppShell } from '@/components/layout/app-shell';
import { requireAppUser } from '@/lib/current-user';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAppUser();
  return <AppShell user={user}>{children}</AppShell>;
}
