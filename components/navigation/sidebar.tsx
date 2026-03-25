import Link from 'next/link';
import { BarChart3, Calendar, ClipboardList, Home, Settings, Users, Wrench } from 'lucide-react';

const roleNav: Record<string, { href: string; label: string; icon: any }[]> = {
  BUILDER_ADMIN: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/claims', label: 'Claims', icon: ClipboardList },
    { href: '/homeowners', label: 'Homeowners', icon: Users },
    { href: '/work-orders', label: 'Work Orders', icon: Wrench },
    { href: '/vendors', label: 'Vendors', icon: Users },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/submit', label: 'Submit Claim', icon: ClipboardList },
  ],
  COORDINATOR: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/claims', label: 'Claims', icon: ClipboardList },
    { href: '/homeowners', label: 'Homeowners', icon: Users },
    { href: '/work-orders', label: 'Work Orders', icon: Wrench },
    { href: '/vendors', label: 'Vendors', icon: Users },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/submit', label: 'Submit Claim', icon: ClipboardList },
  ],
  SUPERINTENDENT: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/claims', label: 'Claims', icon: ClipboardList },
    { href: '/homeowners', label: 'Homeowners', icon: Users },
    { href: '/work-orders', label: 'Work Orders', icon: Wrench },
  ],
  VENDOR: [
    { href: '/claims', label: 'Assigned Claims', icon: ClipboardList },
    { href: '/work-orders', label: 'Work Orders', icon: Wrench },
  ],
  HOMEOWNER: [
    { href: '/claims', label: 'My Claims', icon: ClipboardList },
    { href: '/submit', label: 'Submit Request', icon: ClipboardList },
  ],
};

export function Sidebar({ user }: { user: any }) {
  const navItems = roleNav[user.role] ?? [];
  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Builder Ops</div>
        <h1 className="mt-2 text-2xl font-bold">Warranty Watch</h1>
        <p className="mt-1 text-sm text-slate-500">Merged production starter</p>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-5 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-600 transition hover:bg-slate-100">
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-2xl bg-slate-100 p-4 text-sm">
          <div className="font-semibold">{user.name}</div>
          <div className="mt-1 text-slate-500">{user.email}</div>
          <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">{user.role}</div>
        </div>
      </div>
    </aside>
  );
}
