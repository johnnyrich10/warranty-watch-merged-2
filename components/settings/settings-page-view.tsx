import { Card } from '@/components/ui/card';

export function SettingsPageView({ communities }: { communities: any[] }) {
  return (
    <div className="px-5 py-6 sm:px-8">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5"><h3 className="text-lg font-semibold">Warranty Rules</h3><div className="mt-4 space-y-3 text-sm text-slate-600"><div className="rounded-2xl bg-slate-50 p-4">1-year workmanship coverage</div><div className="rounded-2xl bg-slate-50 p-4">2-year systems coverage</div><div className="rounded-2xl bg-slate-50 p-4">10-year structural coverage</div></div></Card>
        <Card className="p-5"><h3 className="text-lg font-semibold">Communities</h3><div className="mt-4 space-y-3 text-sm text-slate-600">{communities.map((community) => <div key={community.id} className="rounded-2xl bg-slate-50 p-4">{community.name}</div>)}</div></Card>
      </div>
    </div>
  );
}
