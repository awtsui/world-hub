import { S3Client } from '@aws-sdk/client-s3';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_REGION) throw new Error('AWS_REGION not defined');
if (!AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID not defined');
if (!AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY not defined');

let s3Client: S3Client | null;

export default function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  return s3Client;
}
