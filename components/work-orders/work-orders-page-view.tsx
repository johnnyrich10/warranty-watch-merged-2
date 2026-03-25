import { Card } from '@/components/ui/card';
import { WorkOrderCreateForm } from '@/components/work-orders/work-order-create-form';

export function WorkOrdersPageView({ workOrders, vendors, claims, canCreate }: { workOrders: any[]; vendors: any[]; claims: any[]; canCreate: boolean }) {
  return (
    <div className="px-5 py-6 sm:px-8">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="border-b border-slate-200 px-5 py-4"><h3 className="text-lg font-semibold">Work Orders</h3></div>
          <div className="space-y-4 p-5">
            {workOrders.map((wo) => (
              <div key={wo.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-semibold">{wo.claim.claimNumber} • {wo.vendor?.name ?? 'Unassigned'}</div>
                <div className="text-sm text-slate-500">{wo.claim.home.homeowner?.name ?? 'No homeowner'} • {wo.claim.home.address}</div>
                <div className="mt-3 text-sm text-slate-600">Scheduled: {wo.scheduledAt ? new Date(wo.scheduledAt).toLocaleString() : 'Not scheduled'}</div>
                <div className="text-sm text-slate-600">Status: {wo.status}</div>
              </div>
            ))}
          </div>
        </Card>
        {canCreate ? <Card className="p-5"><h3 className="text-lg font-semibold">Dispatch Panel</h3><div className="mt-4"><WorkOrderCreateForm vendors={vendors} claims={claims} /></div></Card> : null}
      </div>
    </div>
  );
}
