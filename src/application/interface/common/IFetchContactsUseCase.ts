import { ConversationResponseDto } from "../../dto/conversationResponse.dto";

export interface IFetchContactsUseCase {
  execute(id: string): Promise<ConversationResponseDto[] | []>;
}
