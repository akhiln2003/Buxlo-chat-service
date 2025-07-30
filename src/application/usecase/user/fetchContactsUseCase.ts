import { InternalServerError } from "@buxlo/common";
import { Chat } from "../../../domain/entities/chat";
import { IfetchContactsUseCase } from "../../interface/user/IfetchContactsUseCase";
import { ImessageRepository } from "../../../infrastructure/@types/ImessageRepository";
import { IchatRepository } from "../../../infrastructure/@types/IchatRepository";

export class FetchContactsUseCase implements IfetchContactsUseCase {
  constructor(
    private chatRepo: IchatRepository,
    private messageRepo: ImessageRepository
  ) {}

  async execute(id: string): Promise<Chat[] | []> {
    try {
      const chats = await this.chatRepo.fetchContacts(id);
      const updatedChats = await Promise.all(
        chats.map(async (chat: any) => {
          const { lastMessage, unreadCount } =
            await this.messageRepo.getLastMessageAndUnreadCount(
              chat.id,
              id
            );

          return {
            ...chat,
            lastMessage,
            unreadCount,
          };
        })
      );

      return updatedChats;
    } catch (error) {
      console.error("Error while fetching chats:", error);
      throw new InternalServerError();
    }
  }
}
