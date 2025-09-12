import { BadRequest } from "@buxlo/common";
import { IChatRepository } from "../@types/IChatRepository";
import { ChatSchema } from "../database/mongodb/schema/chat.schema";
import { Chat } from "../../domain/entities/chat.entity";

export class ChatRepository implements IChatRepository {
  async create(
    userId: string,
    mentorId: string,
    type: "OneToOne" | "Group"
  ): Promise<Chat> {
    try {
      const chat = {
        participants: [userId, mentorId],
        type,
        unreadCount: 0,
      };
      const newChat = ChatSchema.build(chat);
      const data = await newChat.save();
      const populatedChat = await ChatSchema.findById(data._id)
        .populate(
          "participants",
          "name email avatar role status createdAt updatedAt"
        )
        .lean();

      if (!populatedChat) throw new BadRequest("Chat not found after creation");

      return populatedChat;
    } catch (error: any) {
      throw new Error(`Wile creating chat failed: ${error.message}`);
    }
  }

  async getOneChat(
    type: "OneToOne" | "Group",
    userId?: string,
    mentorId?: string
  ): Promise<Chat | null> {
    try {
      if (type === "OneToOne" && userId && mentorId) {
        const chat = await ChatSchema.findOne({
          type: "OneToOne",
          participants: { $all: [userId, mentorId] },
        });
        return chat ? chat : null;
      }
      return null;
    } catch (error: any) {
      throw new Error(`While fetching chat failed: ${error.message}`);
    }
  }

  async fetchContacts(id: string): Promise<Chat[] | []> {
    try {
      const results = await ChatSchema.aggregate([
        {
          $match: { participants: id },
        },
        {
          $unwind: "$participants",
        },
        {
          $match: { participants: { $ne: id } },
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
              {
                $project: {
                  id: { $toString: "$_id" },
                  _id: 0,
                  name: 1,
                  email: 1,
                  avatar: 1,
                  role: 1,
                  status: 1,
                  createdAt: 1,
                  updatedAt: 1,
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
            id: { $toString: "$_id" },
            _id: 0,
            type: 1,
            lastMessage: 1,
            unreadCount: 1,
            participantDetails: 1,
          },
        },
      ]);

      return results;
    } catch (error: any) {
      throw new Error(`While fetching Contacts: ${error.message}`);
    }
  }
}
