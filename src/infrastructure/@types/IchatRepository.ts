import { Chat } from "../../domain/entities/chat";

export interface IchatRepository {
  create(
    userId: string,
    mentorId: string,
    type: "OneToOne" | "Group"
  ): Promise<Chat>;
  getOneChat( type:  "OneToOne" | "Group" , userId ?: string , mentorId?:string ):Promise<Chat|null>
  fetchContacts( id :string ):Promise<Chat[] | [] >
  //   update(id: string, query: object): Promise<Chat>;
}
