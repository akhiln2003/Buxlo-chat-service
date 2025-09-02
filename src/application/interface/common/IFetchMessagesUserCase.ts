import { MessageResponseDto } from "../../../domain/zodSchemaDto/output/messageResponse.dto";

export interface IFetchMessagesUseCase {
  execute(id: string , receiverId:string): Promise<MessageResponseDto[] | []>;
}
