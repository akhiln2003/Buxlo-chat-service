import { BadRequest } from "@buxlo/common";
import { IS3Service } from "../../../infrastructure/@types/IS3Service";
import { IFetchDataFromS3UseCase } from "../../interface/common/IFetchDataFromS3UseCase";

export class FetchDataFromS3UseCase implements IFetchDataFromS3UseCase {
  constructor(private _s3Service: IS3Service) {}

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
