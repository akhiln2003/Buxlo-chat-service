import { Chat } from "../../domain/entities/chat";
import { IchatRepository } from "../../domain/interfaces/IchatRepository";
import { ChatSchema } from "../database/mongodb/schema/chat.schema";

export class ChatRepository implements IchatRepository {
  async create(
    userId: string,
    mentorId: string,
    type: "OneToOne" | "Group"
  ): Promise<Chat> {
    try {
      const chat = {
        participants: [userId, mentorId],
        type,
        unreadCount: 0,
      };
      const newChat = ChatSchema.build(chat);
      return await newChat.save();
    } catch (error: any) {
      //   customLogger.error(`db error: ${error.message }`);
      throw new Error(`Wile creating chat faild : ${error.message}`);
    }
  }

  async getOneChat(
    type: "OneToOne" | "Group",
    userId: string,
    mentorId: string
  ): Promise<Chat | null> {
    try {
      if (type == "OneToOne") {
        return await ChatSchema.findOne({
          type:"OneToOne",
          participants: { $all: [userId, mentorId] },
        });
      }
      return null;
    } catch (error: any) {
      throw new Error(`Wile creating chat faild : ${error.message}`);
    }
  }
}
