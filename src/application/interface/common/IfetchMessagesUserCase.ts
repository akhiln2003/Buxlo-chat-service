import { MessageResponseDto } from "../../../zodSchemaDto/output/messageResponse.dto";

export interface IfetchMessagesUseCase {
  execute(id: string , receiverId:string): Promise<MessageResponseDto[] | []>;
}
