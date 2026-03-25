import { Card } from '@/components/ui/card';

export function VendorsPageView({ vendors }: { vendors: any[] }) {
  return (
    <div className="px-5 py-6 sm:px-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="p-5">
            <div className="text-lg font-semibold">{vendor.name}</div>
            <div className="text-sm text-slate-500">{vendor.trade}</div>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Claims</span><span className="font-medium">{vendor.claims.length}</span></div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span>Work Orders</span><span className="font-medium">{vendor.workOrders.length}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
