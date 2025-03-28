import { Chat } from "../../../domain/entities/chat";

export interface IfetchContactsUseCase {
  execute(id:string): Promise<Chat[] | []>;
}
