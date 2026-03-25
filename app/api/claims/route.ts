import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { claimCreateSchema } from '@/lib/validators';
import { requireAppUser } from '@/lib/current-user';
import { notifyNewClaim } from '@/lib/notifications';

export async function GET() {
  const user = await requireAppUser();
  const where = user.role === 'HOMEOWNER'
    ? { homeownerId: user.homeownerId ?? '' }
    : user.role === 'VENDOR'
      ? { OR: [{ vendorId: user.vendorId ?? '' }, { workOrders: { some: { vendorId: user.vendorId ?? '' } } }] }
      : {};
  const claims = await db.claim.findMany({ where, include: { home: { include: { homeowner: true, community: true } }, vendor: true, workOrders: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(claims);
}

export async function POST(request: Request) {
  const user = await requireAppUser();
  const json = await request.json();
  const parsed = claimCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ message: 'Invalid data', errors: parsed.error.flatten() }, { status: 400 });

  const { homeId, category, description, priority, preferredAccess } = parsed.data;
  const home = await db.home.findUnique({ include: { homeowner: true }, where: { id: homeId } });
  if (!home) return NextResponse.json({ message: 'Home not found' }, { status: 404 });
  if (user.role === 'HOMEOWNER' && home.homeownerId !== user.homeownerId) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  if (!['HOMEOWNER', 'BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const count = await db.claim.count();
  const claimNumber = `CLM-${String(1001 + count).padStart(4, '0')}`;
  const claim = await db.claim.create({
    data: {
      claimNumber, builderId: home.builderId, homeId: home.id, homeownerId: home.homeownerId,
      category, description, priority, status: 'New', preferredAccess,
      statusHistory: { create: [{ status: 'New', note: `Claim created by ${user.role.toLowerCase()}` }] },
    },
    include: { home: { include: { homeowner: true, community: true } }, vendor: true, statusHistory: true },
  });

  const builderAdmin = await db.user.findFirst({ where: { role: 'BUILDER_ADMIN', builderId: home.builderId } });
  await notifyNewClaim({ claimNumber: claim.claimNumber, category: claim.category, address: home.address, builderAdminPhone: builderAdmin?.phone, builderAdminEmail: builderAdmin?.email });
  return NextResponse.json(claim, { status: 201 });
}
