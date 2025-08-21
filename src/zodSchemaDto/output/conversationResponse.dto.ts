import { z } from "zod";
import { MessageResponseDto } from "./messageResponse.dto";
import { UserResponseDto, UserMapper } from "./userResponse.dto";

export const ConversationResponseDto = z.object({
  id: z.string(),
  participantDetails: z.array(UserResponseDto),
  lastMessage: z.union([MessageResponseDto, z.null()]),
  type: z.enum(["OneToOne", "Group"]),
  unreadCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ConversationResponseDto = z.infer<typeof ConversationResponseDto>;

export class ConversationMapper {
  static toDto(conversation: any): ConversationResponseDto {
    const participantDetails =
      conversation.participantDetails && conversation.participantDetails.length
        ? conversation.participantDetails.map((p: any) => UserMapper.toDto(p))
        : (conversation.participants || []).map((p: any) =>
            UserMapper.toDto(p)
          );

    return ConversationResponseDto.parse({
      id: conversation.id?.toString() ?? conversation._id?.toString(),
      participantDetails,
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
