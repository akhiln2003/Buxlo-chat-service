import {
  PutObjectCommandOutput,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";

export interface IS3Service {
  uploadImageToBucket(
    bufferCode: Buffer,
    type: string,
    key: string
  ): Promise<PutObjectCommandOutput>;
  getImageFromBucket(key: string): Promise<string>;
  deleteImageFromBucket(key: string): Promise<DeleteObjectCommandOutput>;
}
