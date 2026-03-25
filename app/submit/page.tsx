import { SubmitClaimForm } from '@/components/submit/submit-claim-form';
import { db } from '@/lib/db';
import { requireAppUser } from '@/lib/current-user';

export default async function SubmitPage() {
  const user = await requireAppUser();
  const where = user.role === 'HOMEOWNER' ? { homeownerId: user.homeownerId ?? '' } : {};
  const homes = await db.home.findMany({ where, include: { homeowner: true, community: true }, orderBy: { address: 'asc' } });
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8"><h1 className="text-3xl font-bold">Submit Warranty Request</h1><p className="mt-2 text-sm text-slate-500">Homeowner intake flow with role-aware access.</p></div>
      <SubmitClaimForm homes={homes} />
    </main>
  );
}
