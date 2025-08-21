import { ConversationResponseDto } from "../../zodSchemaDto/output/conversationResponse.dto";

export interface IchatRepository {
  create(
    userId: string,
    mentorId: string,
    type: "OneToOne" | "Group"
  ): Promise<ConversationResponseDto>;

  getOneChat(
    type: "OneToOne" | "Group",
    userId?: string,
    mentorId?: string
  ): Promise<ConversationResponseDto | null>;

  fetchContacts(id: string): Promise<ConversationResponseDto[] | []>;
}
