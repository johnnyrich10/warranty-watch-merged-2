import { Sidebar } from '@/components/navigation/sidebar';
import { TopBar } from '@/components/navigation/top-bar';

export function AppShell({ children, user }: { children: React.ReactNode; user: any }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar user={user} />
      <div className="flex-1">
        <TopBar user={user} />
        {children}
      </div>
    </div>
  );
}
