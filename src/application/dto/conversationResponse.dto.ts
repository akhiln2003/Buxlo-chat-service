import { z } from "zod";
import { MessageResponseDto } from "./messageResponse.dto";
import { UserResponseDto, UserMapper } from "../dto/userResponse.dto";
import { Chat } from "../../domain/entities/chat.entity";

export const ConversationResponseDto = z.object({
  id: z.string(),
  participants: z.array(z.union([z.string(), UserResponseDto])),
  lastMessage: z.union([MessageResponseDto, z.null()]),
  type: z.enum(["OneToOne", "Group"]),
  unreadCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ConversationResponseDto = z.infer<typeof ConversationResponseDto>;
interface Iconversation extends Chat {
  lastmessage?: MessageResponseDto | null;
  participantDetails?: UserResponseDto[];
  _id?: string;
}
export class ConversationMapper {
  static toDto(conversation: Iconversation): ConversationResponseDto {
    let participantDetails: (string | ReturnType<typeof UserMapper.toDto>)[] =
      [];

    if (
      conversation.participantDetails &&
      conversation.participantDetails.length
    ) {
      // case: we have full user details
      participantDetails = conversation.participantDetails.map((p: any) =>
        UserMapper.toDto(p)
      );
    } else if (conversation.participants && conversation.participants.length) {
      participantDetails = conversation.participants.map((p: any) =>
        typeof p === "string" ? p : p.toString()
      );
    }

    return ConversationResponseDto.parse({
      id: conversation.id?.toString() ?? conversation._id?.toString(),
      participants: participantDetails,
      lastMessage: conversation.lastMessage ?? null,
      type: conversation.type,
      unreadCount: conversation.unreadCount ?? 0,
      createdAt: conversation.createdAt
        ? new Date(conversation.createdAt)
        : new Date(),
      updatedAt: conversation.updatedAt
        ? new Date(conversation.updatedAt)
        : new Date(),
    });
  }
}
