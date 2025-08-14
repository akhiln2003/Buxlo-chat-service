import { Message } from "../../../domain/entities/message";
import { ImessageRepository } from "../../../infrastructure/@types/ImessageRepository";
import { IfetchMessagesUseCase } from "../../interface/common/IfetchMessagesUserCase";

export class FetchMessagesUsesCase implements IfetchMessagesUseCase {
  constructor(private _messageRepo: ImessageRepository) {}
  async execute(id: string, receiverId: string): Promise<Message[] | []> {
    try {
      const messages = await this._messageRepo.fetchMessage(id, receiverId);
      return messages;
    } catch (error) {
      console.error("Error from fetchMessagesUsesCase :", error);
      return [];
    }
  }
}
