import { Message } from "../../../domain/entities/message";
import { MessageResponseDto } from "../../../zodSchemaDto/output/messageResponse.dto";

export interface IcreateMessageUseCase {
  execute(
    data: Partial<Message>,
    file?: Express.Multer.File
  ): Promise<MessageResponseDto | null>;
}
