import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export function TopBar({ user }: { user: any }) {
  return (
    <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Warranty Watch</h2>
          <p className="text-sm text-slate-500">Signed in as {user.name} • {user.role}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/claims" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">Claims</Link>
          <UserButton afterSignOutUrl="/auth/sign-in" />
        </div>
      </div>
    </header>
  );
}
