import { InternalServerError } from "@buxlo/common";
import { Chat } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../infrastructure/repositories/chat.Repository";
import { IconnectMentorUseCase } from "../../interface/user/IconnectMentorUseCase";

export class ConnectMentorUseCase implements IconnectMentorUseCase {
  constructor(private _chatRepo: ChatRepository) {}
  async execute(userId: string, mentorId: string): Promise<Chat | null> {
    try {
      const chat = await this._chatRepo.getOneChat(
        "OneToOne",
        userId,
        mentorId
      );
      if (!chat) {
        return this._chatRepo.create(userId, mentorId, "OneToOne");
      }
      return chat;
    } catch (error) {
      console.error("Error wile connect mentor : ", error);

      throw new InternalServerError();
    }
  }
}
