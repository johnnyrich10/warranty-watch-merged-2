import { z } from 'zod';

export const claimCreateSchema = z.object({
  homeId: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(10),
  priority: z.enum(['Low', 'Medium', 'High']),
  preferredAccess: z.string().max(255).optional().nullable(),
});

export const claimUpdateSchema = z.object({
  status: z.enum(['New', 'Under Review', 'Inspection Scheduled', 'Assigned', 'In Progress', 'Waiting on Parts', 'Completed', 'Closed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  vendorId: z.string().nullable().optional(),
  note: z.string().max(5000).optional(),
});

export const workOrderCreateSchema = z.object({
  claimId: z.string().min(1),
  vendorId: z.string().min(1),
  status: z.string().min(1),
  scheduledAt: z.string().optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});
