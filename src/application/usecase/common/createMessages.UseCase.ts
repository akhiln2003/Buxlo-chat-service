import { BadRequest, InternalServerError } from "@buxlo/common";
import { Message } from "../../../domain/entities/message";
import { ImessageRepository } from "../../../infrastructure/@types/ImessageRepository";
import { IcreateMessageUseCase } from "../../interface/common/IcreateMessageUseCase";
import { Is3Service } from "../../../infrastructure/@types/Is3Service";

export class CreateMessageUseCase implements IcreateMessageUseCase {
  constructor(
    private _messageRepo: ImessageRepository,
    private _s3Service: Is3Service
  ) {}
  async execute(
    data: Partial<Message>,
    file?: Express.Multer.File
  ): Promise<Message | null> {
    try {
      if (file) {
        const randomImageName = Math.random() + Date.now();
        const response = await this._s3Service.uploadImageToBucket(
          file.buffer,
          file.mimetype,
          `${data.contentType}/${randomImageName}`
        );
        if (response.$metadata.httpStatusCode == 200) {
          data = {
            ...data,
            content: `${randomImageName}`,
          };
        } else {
          throw new BadRequest("Faild to send file try again");
        }
      }
      return await this._messageRepo.create(data as Message);
    } catch (error) {
      console.error("Error wile connect mentor : ", error);
      throw new InternalServerError();
    }
  }
}
