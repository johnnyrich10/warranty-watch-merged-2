import { Card } from '@/components/ui/card';

export function HomeownersPageView({ homeowners }: { homeowners: any[] }) {
  return (
    <div className="px-5 py-6 sm:px-8">
      <Card>
        <div className="border-b border-slate-200 px-5 py-4"><h3 className="text-lg font-semibold">Homeowners</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-4 font-medium">Name</th><th className="px-5 py-4 font-medium">Homes</th><th className="px-5 py-4 font-medium">Open Claims</th><th className="px-5 py-4 font-medium">Email</th></tr></thead>
            <tbody>
              {homeowners.map((homeowner) => (
                <tr key={homeowner.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-slate-800">{homeowner.name}</td>
                  <td className="px-5 py-4 text-slate-600">{homeowner.homes.map((h: any) => h.address).join(', ')}</td>
                  <td className="px-5 py-4 text-slate-600">{homeowner.claims.filter((c: any) => c.status !== 'Closed').length}</td>
                  <td className="px-5 py-4 text-slate-600">{homeowner.email ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
