import { Message } from "../../domain/entities/message";

export interface IMessageRepository {
  create(message: Message): Promise<Message>;
  fetchMessage(chatId: string, receiverId: string): Promise<Message[] | []>;
  getLastMessageAndUnreadCount(
    chatId: string,
    receiverId: string
  ): Promise<{
    lastMessage: Message | null;
    unreadCount: number;
  }>;
  updateMessage(chatId: string, receiverId: string): Promise<Message[] | []>;
}
