import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export async function getAppUser() {
  const { userId } = await auth();
  if (!userId) return null;
  return db.user.findUnique({
    where: { clerkUserId: userId },
    include: { builder: true, homeowner: true, vendor: true },
  });
}

export async function requireAppUser() {
  const user = await getAppUser();
  if (!user) redirect('/auth/sign-in');
  return user;
}

export async function requireRole(roles: string[]) {
  const user = await requireAppUser();
  if (!roles.includes(user.role)) redirect('/claims');
  return user;
}
