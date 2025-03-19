import { Chat } from "../../../domain/entities/chat";

export interface IconnectMentorUseCase{
    execute(userId: string , mentorId:string): Promise<Chat|null>;
    
}