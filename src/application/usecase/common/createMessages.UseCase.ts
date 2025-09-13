import { BadRequest, InternalServerError } from "@buxlo/common";
import { IMessageRepository } from "../../../infrastructure/@types/IMessageRepository";
import { ICreateMessageUseCase } from "../../interface/common/ICreateMessageUseCase";
import { IS3Service } from "../../../infrastructure/@types/IS3Service";
import {
  MessageMapper,
  MessageResponseDto,
} from "../../dto/messageResponse.dto";
import { IMessageData } from "../../interface/common/IMessage";

export class CreateMessageUseCase implements ICreateMessageUseCase {
  constructor(
    private _messageRepo: IMessageRepository,
    private _s3Service: IS3Service
  ) {}
  async execute(
    data: IMessageData,
    file?: Express.Multer.File
  ): Promise<MessageResponseDto | null> {
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
      const savedMessage = await this._messageRepo.create(data);
      return MessageMapper.toDto(savedMessage);
    } catch (error) {
      console.error("Error wile connect mentor : ", error);
      throw new InternalServerError();
    }
  }
}
