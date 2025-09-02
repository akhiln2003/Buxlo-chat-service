import { InternalServerError } from "@buxlo/common";
import { IConnectMentorUseCase } from "../../interface/user/IConnectMentorUseCase";
import { IChatRepository } from "../../../infrastructure/@types/IChatRepository";
import {
  ConversationMapper,
  ConversationResponseDto,
} from "../../../domain/zodSchemaDto/output/conversationResponse.dto";

export class ConnectMentorUseCase implements IConnectMentorUseCase {
  constructor(private _chatRepo: IChatRepository) {}
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
