import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as fs from 'fs';
import { execSync } from 'node:child_process';
import * as path from 'path';
import s3 = cdk.aws_s3;
import s3deploy = cdk.aws_s3_deployment;

export interface NextJsAssetsProps {
  buildImageDigest: string;
}

export class NextJsAssets extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly bucketDeployment: s3deploy.BucketDeployment;

  constructor(scope: Construct, id: string, props: NextJsAssetsProps) {
    super(scope, id);

    // Create the S3 Bucket (or use an existing one)
    this.bucket = new s3.Bucket(this, 'WvWGGNextJsAssetsBucket', {
      publicReadAccess: false, 
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, //  TODO: Change to RETAIN for production?
      autoDeleteObjects: true, //  TODO: Change to false for production?
    });

    // Extract Assets from Docker Image
    const assetsDir = this.extractAssetsFromImage(props.buildImageDigest);

    // Upload Assets to S3
    this.bucketDeployment = new s3deploy.BucketDeployment(this, 'DeployAssets', {
      sources: [s3deploy.Source.asset(assetsDir)],
      destinationBucket: this.bucket,
      destinationKeyPrefix: '_next/static',
    });
  }

    private extractAssetsFromImage(imageDigest: string): string {
        const tempDir = fs.mkdtempSync(path.join('/tmp', 'nextjs-static-assets-'));
        const containerId = execSync(`docker create ${imageDigest}`).toString().trim();

        // TODO: This should probably be a parameter.
        const staticAssetsPath = '/app/.next/static';

        try {
            // Copy the assets out of the container.
            execSync(`docker cp ${containerId}:${staticAssetsPath} ${tempDir}`);
        } catch (error) {
            console.error('Failed to copy assets from container', error);
            throw error;
        }

        try {
            // Cleanup: Remove the container.
            execSync(`docker rm ${containerId}`);
        } catch (error) {
            console.error('Failed to remove container', error);
            throw error;
        }

        return path.join(tempDir, 'static');
    }
} 