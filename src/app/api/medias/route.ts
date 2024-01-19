import Media from '@/lib/mongodb/models/Media';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    const mediaId = searchParams.get('id');
    let data;
    if (mediaId) {
      data = await Media.findById(mediaId);
    }

    if (!data) {
      throw Error('Failed to retrieve media');
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error (/api/medias): ${error}` },
      { status: 500 }
    );
  }
}
