import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE() {
  return NextResponse.json(
    { message: 'Temporarily disabled during deployment setup' },
    { status: 503 }
  );
}
