import { ConversationResponseDto } from "../../../domain/zodSchemaDto/output/conversationResponse.dto";

export interface IFetchContactsUseCase {
  execute(id: string): Promise<ConversationResponseDto[] | []>;
}
