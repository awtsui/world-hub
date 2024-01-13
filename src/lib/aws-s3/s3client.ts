import { S3Client } from '@aws-sdk/client-s3';

const { AWS_REGION } = process.env;

if (!AWS_REGION) throw new Error('AWS_REGION not defined');

let s3Client: S3Client | null;

export default function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: AWS_REGION,
    });
  }

  return s3Client;
}
