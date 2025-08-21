import { ConversationResponseDto } from "../../../zodSchemaDto/output/conversationResponse.dto";

export interface IfetchContactsUseCase {
  execute(id: string): Promise<ConversationResponseDto[] | []>;
}
