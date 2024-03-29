import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import getS3Client from '@/lib/aws-s3/utils/s3client';
import Media from '@/lib/mongodb/models/Media';
import dbConnect from '@/lib/mongodb/utils/mongoosedb';
import mongoose, { ClientSession } from 'mongoose';

const { AWS_S3_BUCKET_NAME } = process.env;

if (!AWS_S3_BUCKET_NAME) throw new Error('AWS_S3_BUCKET_NAME not defined');

const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

const MAX_FILE_SIZE = 1024 * 1024 * 10;

// const SESSION_TOKEN_COOKIE =
//   NODE_ENV == 'development'
//     ? 'next-auth.session-token'
//     : '__Secure-next-auth.session-token';

function generateFileName(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

export async function GET(request: NextRequest) {
  await dbConnect();

  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileType = searchParams.get('type');
    const fileSize = searchParams.get('size');
    const hostId = searchParams.get('id');

    if (!fileType || !fileSize || !hostId) {
      throw Error('Parameters not properly defined');
    }

    if (!acceptedFileTypes.includes(fileType)) {
      throw Error('Invalid file type');
    }

    if (parseInt(fileSize) > MAX_FILE_SIZE) {
      throw Error('File too large');
    }

    const fileName = generateFileName();

    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
      ContentLength: parseInt(fileSize),
      Metadata: {
        userId: hostId,
      },
    });

    const presignedUrl = await getSignedUrl(getS3Client(), command, {
      expiresIn: 60,
    });

    const newMedia = await Media.create(
      [
        {
          type: fileType,
          fileName,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return NextResponse.json({ presignedUrl, mediaId: newMedia[0]._id.toString() }, { status: 200 });
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json({ error: `Internal Server Error (/api/upload): ${error}` }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
