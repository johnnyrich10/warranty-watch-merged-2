import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  await auth();
  return NextResponse.redirect(new URL('/auth/sign-in', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
