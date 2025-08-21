import { InternalServerError } from "@buxlo/common";
import { IconnectMentorUseCase } from "../../interface/user/IconnectMentorUseCase";
import { ConversationResponseDto } from "../../../zodSchemaDto/output/conversationResponse.dto";
import { IchatRepository } from "../../../infrastructure/@types/IchatRepository";

export class ConnectMentorUseCase implements IconnectMentorUseCase {
  constructor(private _chatRepo: IchatRepository) {}
  async execute(
    userId: string,
    mentorId: string
  ): Promise<ConversationResponseDto> {
    try {
      const chat = await this._chatRepo.getOneChat(
        "OneToOne",
        userId,
        mentorId
      );

      if (!chat)
        return await this._chatRepo.create(userId, mentorId, "OneToOne");

      return chat;
    } catch (error) {
      console.error("Error wile connect mentor : ", error);

      throw new InternalServerError();
    }
  }
}
