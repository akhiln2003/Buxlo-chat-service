import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IS3Service } from "../@types/IS3Service";
import dotenv from "dotenv";
import { BadRequest } from "@buxlo/common";

dotenv.config();

export class S3Service implements IS3Service {
  private _s3: S3Client;
  private _bucketName: string;

  constructor() {
    this._bucketName = process.env.AWS_S3_BUCKET_NAME as string;
    const bucketRegion: string = process.env.AWS_S3_BUCKET_REGION as string;
    const accessKey: string = process.env.AWS_S3_BUCKET_ACCESS_KEY as string;
    const secretAccessKey: string = process.env
      .AWS_S3_BUCKET_SECRET_ACCESS_KEY as string;

    this._s3 = new S3Client({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      },
      region: bucketRegion,
    });
  }

  async uploadImageToBucket(
    bufferCode: Buffer,
    type: string,
    key: string
  ): Promise<PutObjectCommandOutput> {
    try {
      const params = {
        Bucket: this._bucketName,
        Key: key,
        Body: bufferCode,
        ContentType: type,
      };

      const command = new PutObjectCommand(params);
      const data = await this._s3.send(command);
      return data;
    } catch (error: any) {
      console.error("error from s3 service ", error);
      throw new BadRequest(`Faild to updateImages  ${error.message}`);
    }
  }

  async getImageFromBucket(key: string): Promise<string> {
    try {
      const imageUrl = await getSignedUrl(
        this._s3,
        new GetObjectCommand({
          Bucket: this._bucketName,
          Key: key,
        }),
        { expiresIn: 60 }
      );
      return imageUrl;
    } catch (error: any) {
      console.error(error);

      throw new BadRequest(`Faild to get images  ${error.message}`);
    }
  }

  async deleteImageFromBucket(key: string): Promise<DeleteObjectCommandOutput> {
    try {
      const deleteParams = {
        Bucket: this._bucketName,
        Key: key,
      };
      const data = await this._s3.send(new DeleteObjectCommand(deleteParams));

      return data;
    } catch (error: any) {
      throw new BadRequest(`Faild to delete image  ${error.message}`);
    }
  }
}
