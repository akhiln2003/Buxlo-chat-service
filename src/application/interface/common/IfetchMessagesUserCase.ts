import { Message } from "../../../domain/entities/message";

export interface IfetchMessagesUseCase {
  execute(id: string): Promise<Message[] | []>;
}
