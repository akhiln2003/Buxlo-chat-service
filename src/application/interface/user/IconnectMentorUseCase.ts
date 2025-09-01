import { ConversationResponseDto } from "../../../domain/zodSchemaDto/output/conversationResponse.dto";

export interface IconnectMentorUseCase{
    execute(userId: string , mentorId:string): Promise<ConversationResponseDto>;
    
}