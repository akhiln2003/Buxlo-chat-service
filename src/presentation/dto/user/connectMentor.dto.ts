import { z } from "zod";

export const connectMentorDto = z.object({
  userId: z.string().refine(
    (id) => {
      return /^[0-9a-f]{24}$/.test(id);
    },
    {
      message: "Invalid MongoDB ObjectId (User ID)",
    }
  ),
  mentorId: z.string().refine(
    (id) => {
      return /^[0-9a-f]{24}$/.test(id);
    },
    {
      message: "Invalid MongoDB ObjectId (Mentor ID)",
    }
  ),
});
