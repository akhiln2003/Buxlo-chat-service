import { MessageResponseDto } from "../../../domain/zodSchemaDto/output/messageResponse.dto";

export interface IfetchMessagesUseCase {
  execute(id: string , receiverId:string): Promise<MessageResponseDto[] | []>;
}
