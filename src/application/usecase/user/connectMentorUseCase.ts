import { InternalServerError } from "@buxlo/common";
import { IconnectMentorUseCase } from "../../interface/user/IconnectMentorUseCase";
import { IchatRepository } from "../../../infrastructure/@types/IchatRepository";
import {
  ConversationMapper,
  ConversationResponseDto,
} from "../../../domain/zodSchemaDto/output/conversationResponse.dto";

export class ConnectMentorUseCase implements IconnectMentorUseCase {
  constructor(private _chatRepo: IchatRepository) {}
  async execute(
    userId: string,
    mentorId: string
  ): Promise<ConversationResponseDto> {
    try {
      let chat = await this._chatRepo.getOneChat("OneToOne", userId, mentorId);

      if (!chat)
        chat = await this._chatRepo.create(userId, mentorId, "OneToOne");

      return ConversationMapper.toDto(chat);
    } catch (error) {
      console.error("Error wile connect mentor : ", error);

      throw new InternalServerError();
    }
  }
}
