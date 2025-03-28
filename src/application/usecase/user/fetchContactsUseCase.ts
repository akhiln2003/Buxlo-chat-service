import { InternalServerError } from "@buxlo/common";
import { Chat } from "../../../domain/entities/chat";
import { ChatRepository } from "../../../infrastructure/repositories/chat.Repository";
import { IfetchContactsUseCase } from "../../interface/user/IfetchContactsUseCase";

export class FetchContactsUseCase implements IfetchContactsUseCase {
  constructor(private chatRepo: ChatRepository) {}

  async execute(id: string): Promise<Chat[] | []> {
    try {
      return await this.chatRepo.fetchContacts(id);
    } catch (error) {
      console.error("Error wile fetching chats mentor : ", error);
      throw new InternalServerError();
    }
  }
}
