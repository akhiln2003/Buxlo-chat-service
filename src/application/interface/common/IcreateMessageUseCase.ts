import { Message } from "../../../domain/entities/message";

export interface IcreateMessageUseCase {
  execute(message: Message): Promise<Message | null>;
}
