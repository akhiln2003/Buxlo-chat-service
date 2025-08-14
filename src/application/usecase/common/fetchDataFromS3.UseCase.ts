import { BadRequest } from "@buxlo/common";
import { Is3Service } from "../../../infrastructure/@types/Is3Service";
import { IfetchDataFromS3UseCase } from "../../interface/common/IfetchDataFromS3UseCase";

export class FetchDataFromS3UseCase implements IfetchDataFromS3UseCase {
  constructor(private _s3Service: Is3Service) {}

  async execute(keys: string[]): Promise<string[]> {
    try {
      const imageUrls = await Promise.all(
        keys.map((key) => this._s3Service.getImageFromBucket(key))
      );

      return imageUrls;
    } catch (error) {
      console.error("Error fetching images:", error);

      throw new BadRequest("Failed to get images");
    }
  }
}
