import { NextResponse } from 'next/server';

const { WLD_BASE_URL, NEXT_PUBLIC_WLD_CLIENT_ID } = process.env;

if (!WLD_BASE_URL) throw new Error('WLD_BASE_URL not defined');
if (!NEXT_PUBLIC_WLD_CLIENT_ID)
  throw new Error('NEXT_PUBLIC_WLD_CLIENT_ID not defined');

export type VerifyReply = {
  code: string;
  detail?: string;
};

export async function POST(request: Request) {
  try {
    // TODO: Add request body schema check

    const proof = await request.json();
    if (!proof) {
      return NextResponse.json({ error: 'No proof provided' }, { status: 400 });
    }

    const resp = await fetch(
      `${WLD_BASE_URL}/api/v1/verify/${NEXT_PUBLIC_WLD_CLIENT_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proof),
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      return NextResponse.json(
        {
          code: data.code,
          detail: data.detail,
        },
        { status: resp.status }
      );
    }
    return NextResponse.json(
      {
        code: 'success',
      },
      { status: resp.status }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
