import { Message } from "../../../domain/entities/message";

export interface IcreateMessageUseCase {
  execute(
    data: Partial<Message>,
    file?: Express.Multer.File
  ): Promise<Message | null>;
}
