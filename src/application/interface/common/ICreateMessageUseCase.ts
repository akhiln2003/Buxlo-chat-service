import { MessageResponseDto } from "../../dto/messageResponse.dto";
import { IMessageData } from "./IMessage";

export interface ICreateMessageUseCase {
  execute(
    data: IMessageData,
    file?: Express.Multer.File
  ): Promise<MessageResponseDto | null>;
}
