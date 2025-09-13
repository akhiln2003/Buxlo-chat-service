import { MessageResponseDto } from "../../dto/messageResponse.dto";

export interface IFetchMessagesUseCase {
  execute(id: string , receiverId:string): Promise<MessageResponseDto[] | []>;
}
