import { ClientSession } from 'mongoose';
import Media from '../models/Media';
import getS3Client from '@/lib/aws-s3/utils/s3client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import getCloudfrontClient from '@/lib/aws-cloudfront/utils/cloudfrontclient';
import { CreateInvalidationCommand, CreateInvalidationCommandInput } from '@aws-sdk/client-cloudfront';

const { AWS_S3_BUCKET_NAME, AWS_CLOUDFRONT_DISTRIBUTION_ID } = process.env;

if (!AWS_S3_BUCKET_NAME) throw new Error('AWS_S3_BUCKET_NAME not defined');
if (!AWS_CLOUDFRONT_DISTRIBUTION_ID) throw new Error('AWS_CLOUDFRONT_DISTRIBUTION_ID not defined');

export async function deleteMedia(mediaId: string, session?: ClientSession) {
  try {
    const media = await Media.findByIdAndDelete(mediaId, { session });

    if (!media) {
      throw Error('Unable to delete media');
    }

    const s3Client = getS3Client();
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: media.fileName,
    });
    await s3Client.send(deleteObjectCommand);

    const cloudfrontClient = getCloudfrontClient();

    const invalidationParams: CreateInvalidationCommandInput = {
      DistributionId: AWS_CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: media.fileName,
        Paths: {
          Quantity: 1,
          Items: ['/' + media.fileName],
        },
      },
    };

    const invalidationCommand = new CreateInvalidationCommand(invalidationParams);

    await cloudfrontClient.send(invalidationCommand);

    return { success: true };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
