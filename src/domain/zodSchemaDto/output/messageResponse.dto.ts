import { z } from "zod";
import { Message } from "../../entities/message";

export const MessageResponseDto = z.object({
  id: z.string(),
  chatId: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
  contentType: z.string(),
  status: z.string(),
  replyTo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MessageResponseDto = z.infer<typeof MessageResponseDto>;
interface IMessage extends Message {
  _id?: string;
}
export class MessageMapper {
  static toDto(message: IMessage): MessageResponseDto {
    return MessageResponseDto.parse({
      id: message._id?.toString() ?? message.id?.toString(),
      chatId: message.chatId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      contentType: message.contentType,
      status: message.status,
      replyTo: message.replyTo,
      createdAt: new Date(message.createdAt as Date),
      updatedAt: new Date(message.updatedAt as Date),
    });
  }
}
