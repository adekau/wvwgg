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

    // Extract static and public assets from Docker Image
    const staticAssetsDir = this.extractAssetsFromImage(props.buildImageDigest, { assetFolderToCopy: '.next/static', dockerImageWorkDir: '/app', bucketPath: '_next/static' });
    const publicAssetsDir = this.extractAssetsFromImage(props.buildImageDigest, { assetFolderToCopy: 'public', dockerImageWorkDir: '/app', bucketPath: 'public' });

    // Upload Assets to S3
    this.bucketDeployment = new s3deploy.BucketDeployment(this, 'DeployAssets', {
      sources: [s3deploy.Source.asset(staticAssetsDir), s3deploy.Source.asset(publicAssetsDir)],
      destinationBucket: this.bucket
    });
  }

    private extractAssetsFromImage(imageDigest: string, args: { assetFolderToCopy: string, dockerImageWorkDir: string, bucketPath: string }): string {
        const tempDir = fs.mkdtempSync(path.join('/tmp', 'nextjs-assets-'));
        const containerId = execSync(`docker create ${imageDigest}`).toString().trim();

        const assetsPath = path.join(args.dockerImageWorkDir, args.assetFolderToCopy);
        const tempAssetsPathToMake = path.join(tempDir, args.bucketPath);
        try {
            fs.mkdirSync(tempAssetsPathToMake, { recursive: true });
        } catch (error) {
            console.error('Failed to create temp assets path', error);
            throw error;
        }

        const tempAssetsPath = tempAssetsPathToMake.split('/').slice(0, -1).join('/');
        try {
            // Copy the assets out of the container.
            execSync(`docker cp ${containerId}:${assetsPath} ${tempAssetsPath}`);
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
        return tempDir;
    }
} 