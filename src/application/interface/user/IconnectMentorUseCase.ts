import { ConversationResponseDto } from "../../../zodSchemaDto/output/conversationResponse.dto";

export interface IconnectMentorUseCase{
    execute(userId: string , mentorId:string): Promise<ConversationResponseDto>;
    
}