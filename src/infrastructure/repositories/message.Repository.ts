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
      console.error("Error wile creating messages : ", error);
      throw new InternalServerError();
    }
  }

  async fetchMessage(
    chatId: string,
    receiverId: string
  ): Promise<Message[] | []> {
    try {
      await MessageSchema.updateMany(
        {
          chatId,
          receiverId,
          status: { $ne: "read" },
        },
        {
          $set: { status: "read" },
        }
      );
      return await MessageSchema.find({ chatId });
    } catch (error) {
      console.error("Error wile fetching messages : ", error);
      throw new InternalServerError();
    }
  }
  async getLastMessageAndUnreadCount(
    chatId: string,
    receiverId: string
  ): Promise<{
    lastMessage: Message;
    unreadCount: number;
  }> {
    try {
      const [lastMessage] = await MessageSchema.find({ chatId, receiverId })
        .sort({ createdAt: -1 })
        .limit(1);

      const unreadCount = await MessageSchema.countDocuments({
        chatId,
        receiverId,
        status: { $ne: "read" },
      });

      return {
        lastMessage: lastMessage,
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

      const updatedMessages = await MessageSchema.find({
        chatId,
        receiverId,
        status: "read",
      })
        .sort({ createdAt: -1 })
        .lean();

      return updatedMessages;
    } catch (error) {
      console.error("Error while updateing Messages", error);
      throw new InternalServerError();
    }
  }
}
