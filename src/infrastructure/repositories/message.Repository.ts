import { InternalServerError } from "@buxlo/common";
import { Message } from "../../domain/entities/message";
import { ImessageRepository } from "../@types/ImessageRepository";
import { MessageSchema } from "../database/mongodb/schema/message.schema";
import {
  MessageMapper,
  MessageResponseDto,
} from "../../zodSchemaDto/output/messageResponse.dto";

export class MessageRepository implements ImessageRepository {
  async create(message: Message): Promise<MessageResponseDto> {
    try {
      const newMessage = MessageSchema.build(message);
      const savedMessage = await newMessage.save();
      return MessageMapper.toDto(savedMessage.toObject());
    } catch (error) {
      console.error("Error while creating messages: ", error);
      throw new InternalServerError();
    }
  }

  async fetchMessage(
    chatId: string,
    receiverId: string
  ): Promise<MessageResponseDto[]> {
    try {
      await MessageSchema.updateMany(
        { chatId, receiverId, status: { $ne: "read" } },
        { $set: { status: "read" } }
      );

      const messages = await MessageSchema.find({ chatId }).lean();
      return messages.map((msg) => MessageMapper.toDto(msg));
    } catch (error) {
      console.error("Error while fetching messages: ", error);
      throw new InternalServerError();
    }
  }

  async getLastMessageAndUnreadCount(
    chatId: string,
    receiverId: string
  ): Promise<{ lastMessage: MessageResponseDto | null; unreadCount: number }> {
    try {
      const lastMessage = await MessageSchema.findOne({ chatId })
        .sort({ createdAt: -1 })
        .lean();

      const unreadCount = await MessageSchema.countDocuments({
        chatId,
        receiverId,
        status: { $ne: "read" },
      });

      return {
        lastMessage: lastMessage ? MessageMapper.toDto(lastMessage) : null,
        unreadCount,
      };
    } catch (error) {
      console.error(
        "Error while getting last message and unread count:",
        error
      );
      throw new InternalServerError();
    }
  }

  async updateMessage(
    chatId: string,
    receiverId: string
  ): Promise<MessageResponseDto[]> {
    try {
      await MessageSchema.updateMany(
        { chatId, receiverId, status: { $ne: "read" } },
        { $set: { status: "read" } }
      );

      const updatedMessages = await MessageSchema.find({
        chatId,
        receiverId,
        status: "read",
      })
        .sort({ createdAt: -1 })
        .lean();

      return updatedMessages.map((msg) => MessageMapper.toDto(msg));
    } catch (error) {
      console.error("Error while updating messages", error);
      throw new InternalServerError();
    }
  }
}
