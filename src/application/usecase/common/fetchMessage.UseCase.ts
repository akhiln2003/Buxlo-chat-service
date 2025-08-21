import { ImessageRepository } from "../../../infrastructure/@types/ImessageRepository";
import { MessageResponseDto } from "../../../zodSchemaDto/output/messageResponse.dto";
import { IfetchMessagesUseCase } from "../../interface/common/IfetchMessagesUserCase";

export class FetchMessagesUsesCase implements IfetchMessagesUseCase {
  constructor(private _messageRepo: ImessageRepository) {}
  async execute(
    id: string,
    receiverId: string
  ): Promise<MessageResponseDto[] | []> {
    try {
      const messages = await this._messageRepo.fetchMessage(id, receiverId);
      return messages;
    } catch (error) {
      console.error("Error from fetchMessagesUsesCase :", error);
      return [];
    }
  }
}
