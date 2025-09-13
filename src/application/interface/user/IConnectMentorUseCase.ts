import { ConversationResponseDto } from "../../dto/conversationResponse.dto";

export interface IConnectMentorUseCase{
    execute(userId: string , mentorId:string): Promise<ConversationResponseDto>;
    
}