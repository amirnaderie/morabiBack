import { ConfigService } from '@nestjs/config';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ReadStream } from 'typeorm/platform/PlatformTools';

@Injectable()
export class s3Service {
  private bucketName = this.configService.get('S3_SECRET_BUCKET_NAME');
  private client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: 'us-east-1',
      endpoint: this.configService.get('ARVAN_STORAGE_DOMAIN_TEHRAN_SHAHRIAR'),
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async createBucket() {
    try {
      await this.client.send(
        new CreateBucketCommand({
          Bucket: this.bucketName,
          ACL: 'public-read', // 'private' | 'public-read'
        }),
      );
    } catch (error) {
      throw new ServiceUnavailableException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async headBucket() {
    try {
      await this.client.send(
        new HeadBucketCommand({
          Bucket: this.bucketName,
        }),
      );
    } catch (err) {
      if (err.$metadata && err.$metadata.httpStatusCode) {
        return this.createBucket();
      }
      throw new ServiceUnavailableException(
        '##### Cant Access To Storage Object Bucket #####',
      );
    }
  }

  async storeObject(file: ReadStream, fileName: string) {
    try {
      await this.headBucket();
      const uploadParams = {
        Body: file,
        Key: fileName,
        Bucket: this.bucketName,
        ACL: 'public-read',
      };
      return await this.client.send(new PutObjectCommand(uploadParams as any));
    } catch (err) {
      console.error(err, 'err');
    }
  }

  async deleteObject(fileName: string, realmId: number) {
    try {
      await this.headBucket();
      const deleteParams = {
        Key: `${realmId}/${fileName}`,
        Bucket: this.bucketName,
      };
      return await this.client.send(new DeleteObjectCommand(deleteParams));
    } catch (err) {
      console.error(err, 'err');
    }
  }
}
