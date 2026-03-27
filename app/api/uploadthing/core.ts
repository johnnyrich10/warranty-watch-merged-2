import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { z } from "zod";
const f = createUploadthing();

export const ourFileRouter = {
  claimImage: f({ image: { maxFileSize: '8MB', maxFileCount: 6 } })
   .input(z.object({ claimId: z.string().min(1) }))
    .middleware(async ({ input }) => {
      const { userId } = await auth();
      if (!userId) throw new Error('Unauthorized');
      const user = await db.user.findUnique({ where: { clerkUserId: userId } });
      if (!user) throw new Error('Unauthorized');
      const claim = await db.claim.findUnique({ where: { id: input.claimId }, include: { workOrders: true } });
      if (!claim) throw new Error('Claim not found');
const allowed =
  ['BUILDER_ADMIN', 'COORDINATOR', 'SUPERINTENDENT'].includes(user.role) ||
  (user.role === 'HOMEOWNER' && claim.homeownerId === user.homeownerId) ||
  (user.role === 'VENDOR' &&
    (claim.vendorId === user.vendorId ||
      (claim.workOrders as any[]).some((wo) => wo.vendorId === user.vendorId)));

if (!allowed) throw new Error('Forbidden');
      return { userId, claimId: input.claimId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.claimAttachment.create({ data: { claimId: metadata.claimId, url: file.url, kind: file.type, fileName: file.name } });
      return { url: file.url, claimId: metadata.claimId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
