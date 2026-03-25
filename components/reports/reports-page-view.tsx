import { Card } from '@/components/ui/card';

export function ReportsPageView({ claims }: { claims: any[] }) {
  const counts = claims.reduce((acc: Record<string, number>, claim: any) => {
    acc[claim.category] = (acc[claim.category] ?? 0) + 1;
    return acc;
  }, {});
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <div className="px-5 py-6 sm:px-8">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Card className="p-5"><h3 className="text-lg font-semibold">Recurring Issues by Category</h3><div className="mt-4 space-y-3">{sorted.map(([title, total]) => <div key={title} className="rounded-2xl bg-slate-50 p-4"><div className="font-medium">{title}</div><div className="text-sm text-slate-500">{total} total claims</div></div>)}</div></Card>
        <Card className="p-5"><h3 className="text-lg font-semibold">Executive Snapshot</h3><div className="mt-4 space-y-3 text-sm text-slate-600"><div className="rounded-2xl bg-slate-50 p-4">Total claims: <span className="font-semibold text-slate-900">{claims.length}</span></div><div className="rounded-2xl bg-slate-50 p-4">Open claims: <span className="font-semibold text-slate-900">{claims.filter((c) => c.status !== 'Closed').length}</span></div></div></Card>
      </div>
    </div>
  );
}
