import { CloudFrontClient } from '@aws-sdk/client-cloudfront';

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_REGION) throw new Error('AWS_REGION not defined');
if (!AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID not defined');
if (!AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY not defined');

let cloudfrontClient: CloudFrontClient | null;

export default function getCloudfrontClient() {
  if (!cloudfrontClient) {
    cloudfrontClient = new CloudFrontClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  return cloudfrontClient;
}
