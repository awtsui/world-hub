import { ClientSession } from 'mongoose';
import Media from '../models/Media';
import getS3Client from '@/lib/aws-s3/s3client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

const { AWS_S3_BUCKET_NAME } = process.env;

if (!AWS_S3_BUCKET_NAME) throw new Error('AWS_S3_BUCKET_NAME not defined');

export async function deleteMedia(mediaId: string, session?: ClientSession) {
  try {
    const media = await Media.findByIdAndDelete(mediaId, { session });

    if (!media) {
      throw Error('Unable to delete media');
    }

    const s3Client = getS3Client();
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: media.url.split('/').pop()!,
    });
    await s3Client.send(deleteObjectCommand);

    return { success: true };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
