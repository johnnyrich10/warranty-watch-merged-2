import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const attachment = await db.claimAttachment.findUnique({ where: { id }, include: { claim: { include: { workOrders: true } } } });
  if (!attachment) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  const allowed = ['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role) || (user.role === 'HOMEOWNER' && attachment.claim.homeownerId === user.homeownerId);
  if (!allowed) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  await db.claimAttachment.delete({ where: { id: attachment.id } });
  return NextResponse.json({ ok: true });
}
