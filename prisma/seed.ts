import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.claimStatusHistory.deleteMany();
  await prisma.claimNote.deleteMany();
  await prisma.claimAttachment.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.home.deleteMany();
  await prisma.homeowner.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.community.deleteMany();
  await prisma.builder.deleteMany();

  const builder = await prisma.builder.create({ data: { name: 'Austin Ridge Homes' } });
  const communities = await Promise.all([
    prisma.community.create({ data: { name: 'Cedar Ridge', builderId: builder.id } }),
    prisma.community.create({ data: { name: 'Willow Creek', builderId: builder.id } }),
    prisma.community.create({ data: { name: 'Stone Oak', builderId: builder.id } }),
  ]);

  const homeowners = await Promise.all([
    prisma.homeowner.create({ data: { name: 'Sarah Johnson', email: 'homeowner@demo.com', phone: '+15555550103' } }),
    prisma.homeowner.create({ data: { name: 'Mark Evans', email: 'mark@example.com' } }),
    prisma.homeowner.create({ data: { name: 'Ashley Brown', email: 'ashley@example.com' } }),
  ]);

  const homes = await Promise.all([
    prisma.home.create({ data: { address: '1427 Cedar Ridge Dr', closeDate: new Date('2025-12-14'), builderId: builder.id, communityId: communities[0].id, homeownerId: homeowners[0].id } }),
    prisma.home.create({ data: { address: '311 Willow Creek Ln', closeDate: new Date('2025-11-21'), builderId: builder.id, communityId: communities[1].id, homeownerId: homeowners[1].id } }),
    prisma.home.create({ data: { address: '909 Stone Oak Ct', closeDate: new Date('2025-10-30'), builderId: builder.id, communityId: communities[2].id, homeownerId: homeowners[2].id } }),
  ]);

  const vendors = await Promise.all([
    prisma.vendor.create({ data: { name: 'CoolAir Services', trade: 'HVAC', builderId: builder.id } }),
    prisma.vendor.create({ data: { name: 'FlowRight Plumbing', trade: 'Plumbing', builderId: builder.id } }),
    prisma.vendor.create({ data: { name: 'Premier Repairs', trade: 'Drywall', builderId: builder.id } }),
  ]);

  const claim1 = await prisma.claim.create({
    data: {
      claimNumber: 'CLM-1042',
      builderId: builder.id,
      homeId: homes[0].id,
      homeownerId: homeowners[0].id,
      vendorId: vendors[0].id,
      category: 'HVAC',
      description: 'Upstairs AC not cooling evenly. Condensation line dripping in attic.',
      priority: 'High',
      status: 'Assigned',
      preferredAccess: 'Weekdays after 3 PM',
      statusHistory: { create: [{ status: 'New', note: 'Claim submitted' }, { status: 'Assigned', note: 'Vendor assigned' }] },
    },
  });

  await prisma.workOrder.create({
    data: {
      claimId: claim1.id,
      vendorId: vendors[0].id,
      status: 'Assigned',
      scheduledAt: new Date(),
      notes: 'Inspect upstairs unit and condensation line.',
    },
  });

  await prisma.claim.create({
    data: {
      claimNumber: 'CLM-1041',
      builderId: builder.id,
      homeId: homes[1].id,
      homeownerId: homeowners[1].id,
      category: 'Plumbing',
      description: 'Guest bathroom sink drains slowly and gurgles.',
      priority: 'Medium',
      status: 'Inspection Scheduled',
      preferredAccess: 'Any weekday morning',
      statusHistory: { create: [{ status: 'Inspection Scheduled', note: 'Inspection set for next available slot' }] },
    },
  });

  await prisma.claim.create({
    data: {
      claimNumber: 'CLM-1039',
      builderId: builder.id,
      homeId: homes[2].id,
      homeownerId: homeowners[2].id,
      vendorId: vendors[2].id,
      category: 'Drywall',
      description: 'Settlement crack above stairwell and nail pops in hallway.',
      priority: 'Low',
      status: 'Waiting on Parts',
      preferredAccess: 'Fridays only',
      statusHistory: { create: [{ status: 'Waiting on Parts', note: 'Material order pending' }] },
    },
  });

  await prisma.user.createMany({
    data: [
      { email: 'builder@demo.com', name: 'Builder Admin', role: UserRole.BUILDER_ADMIN, clerkUserId: 'replace_me_builder', builderId: builder.id, phone: '+15555550101' },
      { email: 'coordinator@demo.com', name: 'Warranty Coordinator', role: UserRole.COORDINATOR, clerkUserId: 'replace_me_coordinator', builderId: builder.id },
      { email: 'superintendent@demo.com', name: 'Field Superintendent', role: UserRole.SUPERINTENDENT, clerkUserId: 'replace_me_superintendent', builderId: builder.id },
      { email: 'vendor@demo.com', name: 'Vendor User', role: UserRole.VENDOR, clerkUserId: 'replace_me_vendor', builderId: builder.id, vendorId: vendors[0].id, phone: '+15555550102' },
      { email: 'homeowner@demo.com', name: 'Sarah Johnson', role: UserRole.HOMEOWNER, clerkUserId: 'replace_me_homeowner', homeownerId: homeowners[0].id },
    ],
  });
}

main().finally(async () => prisma.$disconnect());
