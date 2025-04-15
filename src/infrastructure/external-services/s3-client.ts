import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Is3Service } from "../@types/Is3Service";
import dotenv from "dotenv";

dotenv.config();

export class S3Service implements Is3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME as string;
    const bucketRegion: string = process.env.AWS_S3_BUCKET_REGION as string;
    const accessKey: string = process.env.AWS_S3_BUCKET_ACCESS_KEY as string;
    const secretAccessKey: string = process.env
      .AWS_S3_BUCKET_SECRET_ACCESS_KEY as string;

    this.s3 = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      region: bucketRegion,
    });
  }

  async uploadImageToBucket(bufferCode: Buffer, type: string, key: string) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: bufferCode,
        ContentType: type,
      };

      const command = new PutObjectCommand(params);
      const data = await this.s3.send(command);
      return data;
    } catch (error) {
      console.error("error from s3 service ", error);
      return error;
    }
  }

  async getImageFromBucket(key: string) {
    try {
      const imageUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
        { expiresIn: 60 }
      );
      return imageUrl;
    } catch (error) {
      console.error(error);

      return error;
    }
  }

  async deleteImageFromBucket(key: string) {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: key,
      };
      const data = await this.s3.send(new DeleteObjectCommand(deleteParams));

      return data;
    } catch (error) {
      return error;
    }
  }
}
