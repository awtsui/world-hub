import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  if (!tag) {
    return NextResponse.json(
      { error: 'Parameters not defined properly' },
      { status: 400 }
    );
  }
  revalidateTag(tag);
  return NextResponse.json(
    { revalidated: true, now: Date.now() },
    { status: 200 }
  );
}
