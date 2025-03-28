import { Chat } from "../../domain/entities/chat";
import { IchatRepository } from "../@types/IchatRepository";
import { ChatSchema } from "../database/mongodb/schema/chat.schema";

export class ChatRepository implements IchatRepository {
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
      return await newChat.save();
    } catch (error: any) {
      //   customLogger.error(`db error: ${error.message }`);
      throw new Error(`Wile creating chat faild : ${error.message}`);
    }
  }

  async getOneChat(
    type: "OneToOne" | "Group",
    userId: string,
    mentorId: string
  ): Promise<Chat | null> {
    try {
      if (type == "OneToOne") {
        return await ChatSchema.findOne({
          type: "OneToOne",
          participants: { $all: [userId, mentorId] },
        });
      }
      return null;
    } catch (error: any) {
      throw new Error(`Wile creating chat faild : ${error.message}`);
    }
  }

  async fetchContacts(id: string): Promise<Chat[] | []> {
    try {
      return await ChatSchema.aggregate([
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
    } catch (error: any) {
      throw new Error(`While fetching Contacts: ${error.message}`);
    }
  }
}
