import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { claimUpdateSchema } from '@/lib/validators';
import { requireAppUser } from '@/lib/current-user';
import { notifyHomeownerStatusChange } from '@/lib/notifications';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAppUser();
  const claim = await db.claim.findUnique({ where: { id }, include: { home: { include: { homeowner: true, community: true } }, vendor: true, workOrders: { include: { vendor: true } }, statusHistory: true, notes: true, attachments: true } });
  if (!claim) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const allowed = ['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role) || (user.role === 'HOMEOWNER' && claim.homeownerId === user.homeownerId) || (user.role === 'VENDOR' && (claim.vendorId === user.vendorId || claim.workOrders.some((wo: any) => wo.vendorId === user.vendorId)));
  if (!allowed) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  return NextResponse.json(claim);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAppUser();
  if (!['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const json = await request.json();
  const parsed = claimUpdateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ message: 'Invalid data', errors: parsed.error.flatten() }, { status: 400 });
  const existing = await db.claim.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const { status, priority, vendorId, note } = parsed.data;
  const updated = await db.claim.update({
    where: { id },
    data: {
      status: status ?? existing.status,
      priority: priority ?? existing.priority,
      vendorId: vendorId ?? existing.vendorId,
      statusHistory: status ? { create: [{ status, note: note ?? `Status changed to ${status}` }] } : undefined,
      notes: note ? { create: [{ body: note, isInternal: true }] } : undefined,
    },
    include: { home: { include: { homeowner: true, community: true } }, homeowner: true, vendor: true, statusHistory: true, notes: true },
  });
  if (status) {
    await notifyHomeownerStatusChange({ claimNumber: updated.claimNumber, status: updated.status, address: updated.home.address, homeownerPhone: updated.home.homeowner?.phone, homeownerEmail: updated.home.homeowner?.email });
  }
  return NextResponse.json(updated);
}
