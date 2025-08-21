import { Message } from "../../domain/entities/message";
import { MessageResponseDto } from "../../zodSchemaDto/output/messageResponse.dto";

export interface ImessageRepository {
  create(message: Message): Promise<MessageResponseDto>;
  fetchMessage(
    chatId: string,
    receiverId: string
  ): Promise<MessageResponseDto[] | []>;
  getLastMessageAndUnreadCount(
    chatId: string,
    receiverId: string
  ): Promise<{
    lastMessage: MessageResponseDto | null;
    unreadCount: number;
  }>;
  updateMessage(
    chatId: string,
    receiverId: string
  ): Promise<MessageResponseDto[] | []>;
}
