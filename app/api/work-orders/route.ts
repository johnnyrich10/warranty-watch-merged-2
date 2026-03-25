import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workOrderCreateSchema } from '@/lib/validators';
import { requireAppUser } from '@/lib/current-user';
import { notifyAssignedVendor } from '@/lib/notifications';

export async function POST(request: Request) {
  const user = await requireAppUser();
  if (!['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  const json = await request.json();
  const parsed = workOrderCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ message: 'Invalid data', errors: parsed.error.flatten() }, { status: 400 });
  const workOrder = await db.workOrder.create({ data: { claimId: parsed.data.claimId, vendorId: parsed.data.vendorId, status: parsed.data.status, scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null, notes: parsed.data.notes }, include: { claim: { include: { home: { include: { homeowner: true } } } }, vendor: true } });
  await db.claim.update({ where: { id: parsed.data.claimId }, data: { vendorId: parsed.data.vendorId, status: 'Assigned', statusHistory: { create: [{ status: 'Assigned', note: 'Work order created' }] } } });
  const vendorUser = await db.user.findFirst({ where: { vendorId: parsed.data.vendorId } });
  await notifyAssignedVendor({ claimNumber: workOrder.claim.claimNumber, address: workOrder.claim.home.address, vendorPhone: vendorUser?.phone, vendorEmail: vendorUser?.email });
  return NextResponse.json(workOrder, { status: 201 });
}
