import { Message } from "../../domain/entities/message";

export interface ImessageRepository {
  create(message: Message): Promise<Message>;
  fetchMessage( chatId:string ):Promise<Message[] | []>
}
