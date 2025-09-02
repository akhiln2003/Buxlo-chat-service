import {
  MessageMapper,
  MessageResponseDto,
} from "../../../domain/zodSchemaDto/output/messageResponse.dto";
import { IMessageRepository } from "../../../infrastructure/@types/IMessageRepository";
import { IFetchMessagesUseCase } from "../../interface/common/IFetchMessagesUserCase";

export class FetchMessagesUsesCase implements IFetchMessagesUseCase {
  constructor(private _messageRepo: IMessageRepository) {}
  async execute(
    id: string,
    receiverId: string
  ): Promise<MessageResponseDto[] | []> {
    try {
      const messages = await this._messageRepo.fetchMessage(id, receiverId);
      return messages.map((msg) => MessageMapper.toDto(msg));
    } catch (error) {
      console.error("Error from fetchMessagesUsesCase :", error);
      return [];
    }
  }
}
