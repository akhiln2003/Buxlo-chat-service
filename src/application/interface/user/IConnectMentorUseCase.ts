import { ConversationResponseDto } from "../../../domain/zodSchemaDto/output/conversationResponse.dto";

export interface IConnectMentorUseCase{
    execute(userId: string , mentorId:string): Promise<ConversationResponseDto>;
    
}