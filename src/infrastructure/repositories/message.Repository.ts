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

  async fetchMessage(chatId: string): Promise<Message[] | []> {
    try {
      return await MessageSchema.find({ chatId });
    } catch (error) {
      console.error("Error wile fetching messages : ", error);
      throw new InternalServerError();
    }
  }
}
