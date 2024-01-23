import Media from '@/lib/mongodb/models/Media';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import { isExpiredSignedUrl } from '@/lib/utils';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { NextRequest, NextResponse } from 'next/server';

const { AWS_CLOUDFRONT_URL, AWS_CLOUDFRONT_PRIVATE_KEY, AWS_CLOUDFRONT_KEY_PAIR_ID } = process.env;
if (!AWS_CLOUDFRONT_URL) throw new Error('AWS_CLOUDFRONT_URL not defined');
if (!AWS_CLOUDFRONT_PRIVATE_KEY) throw new Error('AWS_CLOUDFRONT_PRIVATE_KEY not defined');
if (!AWS_CLOUDFRONT_KEY_PAIR_ID) throw new Error('AWS_CLOUDFRONT_KEY_PAIR_ID not defined');

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

    if ((data.url && isExpiredSignedUrl(data.url)) || !data.url) {
      const newUrl = getSignedUrl({
        url: `${AWS_CLOUDFRONT_URL}/${data.fileName}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        privateKey: AWS_CLOUDFRONT_PRIVATE_KEY!,
        keyPairId: AWS_CLOUDFRONT_KEY_PAIR_ID!,
      });
      data = {
        ...data,
        url: newUrl,
      };
      await Media.updateOne({ _id: mediaId }, { url: newUrl });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error (/api/medias): ${error}` }, { status: 500 });
  }
}
