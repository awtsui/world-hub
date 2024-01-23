import { WorldcoinVerificationDataRequestBodySchema } from '@/lib/zod/apischema';
import { NextResponse } from 'next/server';

const { WLD_BASE_URL, NEXT_PUBLIC_WLD_CLIENT_ID } = process.env;

if (!WLD_BASE_URL) throw new Error('WLD_BASE_URL not defined');
if (!NEXT_PUBLIC_WLD_CLIENT_ID) throw new Error('NEXT_PUBLIC_WLD_CLIENT_ID not defined');

type VerifyReply = {
  code: string;
  detail?: string;
};

export async function POST(request: Request) {
  try {
    // TODO: Add request body schema check

    const reqBody = await request.json();

    const validatedReqBody = WorldcoinVerificationDataRequestBodySchema.safeParse(reqBody);
    if (!validatedReqBody.success) {
      console.error(validatedReqBody.error.errors);
      throw Error('Invalid request body');
    }

    const resp = await fetch(`${WLD_BASE_URL}/api/v1/verify/app_${NEXT_PUBLIC_WLD_CLIENT_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedReqBody.data),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error({
        code: data.code,
        detail: data.detail,
        status: resp.status,
      });
      throw Error('Worldcoin verification failed');
    }

    return NextResponse.json(
      {
        message: 'Successfully verified worldcoin id',
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${error}` }, { status: 500 });
  }
}
