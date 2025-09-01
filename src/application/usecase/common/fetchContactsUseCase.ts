import { InternalServerError } from "@buxlo/common";
import { IfetchContactsUseCase } from "../../interface/common/IfetchContactsUseCase";
import { ImessageRepository } from "../../../infrastructure/@types/ImessageRepository";
import { IchatRepository } from "../../../infrastructure/@types/IchatRepository";
import {
  ConversationMapper,
  ConversationResponseDto,
} from "../../../domain/zodSchemaDto/output/conversationResponse.dto";
import { MessageMapper } from "../../../domain/zodSchemaDto/output/messageResponse.dto";

export class FetchContactsUseCase implements IfetchContactsUseCase {
  constructor(
    private _chatRepo: IchatRepository,
    private _messageRepo: ImessageRepository
  ) {}

  async execute(id: string): Promise<ConversationResponseDto[] | []> {
    try {
      const chats = await this._chatRepo.fetchContacts(id);

      const updatedChats = await Promise.all(
        chats.map(async (chat: any) => {
          const { lastMessage, unreadCount } =
            await this._messageRepo.getLastMessageAndUnreadCount(chat.id, id);

          return ConversationMapper.toDto({
            ...chat,
            lastMessage: lastMessage ? MessageMapper.toDto(lastMessage) : null,
            unreadCount,
          });
        })
      );

      return updatedChats;
    } catch (error) {
      console.error("Error while fetching chats:", error);
      throw new InternalServerError();
    }
  }
}
