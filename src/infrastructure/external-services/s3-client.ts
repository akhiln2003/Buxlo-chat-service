import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IS3Service } from "../@types/IS3Service";
import dotenv from "dotenv";

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

  async uploadImageToBucket(bufferCode: Buffer, type: string, key: string) {
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
    } catch (error) {
      console.error("error from s3 service ", error);
      return error;
    }
  }

  async getImageFromBucket(key: string) {
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
    } catch (error) {
      console.error(error);

      return error;
    }
  }

  async deleteImageFromBucket(key: string) {
    try {
      const deleteParams = {
        Bucket: this._bucketName,
        Key: key,
      };
      const data = await this._s3.send(new DeleteObjectCommand(deleteParams));

      return data;
    } catch (error) {
      return error;
    }
  }
}
