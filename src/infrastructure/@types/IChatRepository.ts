import { Chat } from "../../domain/entities/chat";

export interface IChatRepository {
  create(
    userId: string,
    mentorId: string,
    type: "OneToOne" | "Group"
  ): Promise<Chat>;

  getOneChat(
    type: "OneToOne" | "Group",
    userId?: string,
    mentorId?: string
  ): Promise<Chat | null>;

  fetchContacts(id: string): Promise<Chat[] | []>;
}
