import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { formatClaim } from '@/lib/formatters';

export function DashboardOverview({ claims, stats }: { claims: any[]; stats: { openClaimsCount: number; vendorCount: number; homeownerCount: number; workOrderCount: number } }) {
  return (
    <div className="space-y-6 px-5 py-6 sm:px-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Open Claims', stats.openClaimsCount],
          ['Vendors', stats.vendorCount],
          ['Homeowners', stats.homeownerCount],
          ['Work Orders', stats.workOrderCount],
        ].map(([label, value]) => (
          <Card key={String(label)} className="p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div className="border-b border-slate-200 px-5 py-4"><h3 className="text-lg font-semibold">Recent Claims</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-4 font-medium">Claim</th><th className="px-5 py-4 font-medium">Homeowner</th><th className="px-5 py-4 font-medium">Address</th><th className="px-5 py-4 font-medium">Status</th><th className="px-5 py-4 font-medium">Vendor</th></tr></thead>
            <tbody>
              {claims.map((claim) => {
                const c = formatClaim(claim);
                return (
                  <tr key={claim.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4"><Link href={`/claims/${claim.id}`} className="font-semibold text-slate-900 hover:underline">{c.claimNumber}</Link><div className="text-xs text-slate-500">{c.category}</div></td>
                    <td className="px-5 py-4">{c.homeownerName}</td>
                    <td className="px-5 py-4">{c.address}</td>
                    <td className="px-5 py-4">{c.status}</td>
                    <td className="px-5 py-4">{c.vendorName ?? 'Unassigned'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
