import { BadRequest } from "@buxlo/common";
import {
  ConversationMapper,
  ConversationResponseDto,
} from "../../zodSchemaDto/output/conversationResponse.dto";
import { IchatRepository } from "../@types/IchatRepository";
import { ChatSchema } from "../database/mongodb/schema/chat.schema";

export class ChatRepository implements IchatRepository {
  async create(
    userId: string,
    mentorId: string,
    type: "OneToOne" | "Group"
  ): Promise<ConversationResponseDto> {
    try {
      const chat = {
        participants: [userId, mentorId],
        type,
        unreadCount: 0,
      };
      const newChat = ChatSchema.build(chat);
      const data = await newChat.save();
      const populatedChat = await ChatSchema.findById(data._id)
        .populate("participants", "name email avatar role status createdAt updatedAt")
        .lean();

      if (!populatedChat) throw new BadRequest("Chat not found after creation");

      return ConversationMapper.toDto(populatedChat);
    } catch (error: any) {
      throw new Error(`Wile creating chat failed: ${error.message}`);
    }
  }

  async getOneChat(
    type: "OneToOne" | "Group",
    userId?: string,
    mentorId?: string
  ): Promise<ConversationResponseDto | null> {
    try {
      if (type === "OneToOne" && userId && mentorId) {
        const chat = await ChatSchema.findOne({
          type: "OneToOne",
          participants: { $all: [userId, mentorId] },
        });
        return chat ? ConversationMapper.toDto(chat) : null;
      }
      return null;
    } catch (error: any) {
      throw new Error(`While fetching chat failed: ${error.message}`);
    }
  }

  async fetchContacts(id: string): Promise<ConversationResponseDto[] | []> {
    try {
      const results = await ChatSchema.aggregate([
        {
          $match: {
            participants: id,
          },
        },
        {
          $unwind: "$participants",
        },
        {
          $match: {
            participants: { $ne: id },
          },
        },
        {
          $lookup: {
            from: "userchats",
            let: { participantId: "$participants" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$_id" }, "$$participantId"] },
                },
              },
            ],
            as: "participantDetails",
          },
        },
        {
          $group: {
            _id: "$_id",
            type: { $first: "$type" },
            lastMessage: { $first: "$lastMessage" },
            unreadCount: { $first: "$unreadCount" },
            participantDetails: {
              $push: { $arrayElemAt: ["$participantDetails", 0] },
            },
          },
        },
        {
          $project: {
            id: "$_id", // Rename _id to id
            _id: 0, // Exclude original _id
            type: 1,
            lastMessage: 1,
            unreadCount: 1,
            participantDetails: 1,
          },
        },
      ]);
      return results.map((c) => ConversationMapper.toDto(c));
    } catch (error: any) {
      throw new Error(`While fetching Contacts: ${error.message}`);
    }
  }
}
