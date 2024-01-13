import { NextRequest, NextResponse } from 'next/server';
import { createEvent } from '@/lib/mongodb/utils/events';
import { EventDataRequestBodySchema } from '@/lib/zod/apischema';

export async function POST(request: NextRequest) {
  // TODO: validate request body
  try {
    const reqBody = await request.json();

    const validatedReqBody = EventDataRequestBodySchema.safeParse(reqBody);
    if (!validatedReqBody.success) {
      throw Error('Invalid request body');
    }

    const resp = await createEvent(validatedReqBody.data);

    if (!resp.success) {
      throw Error(resp.error);
    }

    return NextResponse.json(
      { message: 'Event successfully created!', eventId: resp.eventId },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/events/create): ${error}` },
      { status: 500 }
    );
  }
}
