import { InternalServerError } from "@buxlo/common";
import { Message } from "../../domain/entities/message";
import { ImessageRepository } from "../@types/ImessageRepository";
import { MessageSchema } from "../database/mongodb/schema/message.schema";

export class MessageRepository implements ImessageRepository {
  async create(message: Message): Promise<Message> {
    try {
      const newMessage = MessageSchema.build(message);
      return await newMessage.save();
    } catch (error) {
      console.error("Error while creating messages: ", error);
      throw new InternalServerError();
    }
  }

  async fetchMessage(chatId: string, receiverId: string): Promise<Message[]> {
    try {
      await MessageSchema.updateMany(
        { chatId, receiverId, status: { $ne: "read" } },
        { $set: { status: "read" } }
      );

      return await MessageSchema.find({ chatId }).lean();
    } catch (error) {
      console.error("Error while fetching messages: ", error);
      throw new InternalServerError();
    }
  }

  async getLastMessageAndUnreadCount(
    chatId: string,
    receiverId: string
  ): Promise<{ lastMessage: Message | null; unreadCount: number }> {
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
        lastMessage: lastMessage ? lastMessage : null,
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

  async updateMessage(chatId: string, receiverId: string): Promise<Message[]> {
    try {
      await MessageSchema.updateMany(
        { chatId, receiverId, status: { $ne: "read" } },
        { $set: { status: "read" } }
      );

      return await MessageSchema.find({
        chatId,
        receiverId,
        status: "read",
      })
        .sort({ createdAt: -1 })
        .lean();

    } catch (error) {
      console.error("Error while updating messages", error);
      throw new InternalServerError();
    }
  }
}
