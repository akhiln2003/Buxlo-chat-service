import { z } from "zod";

export const fetchMessagesDto = z.object({
  id: z.string().refine(
    (id) => {
      return /^[0-9a-f]{24}$/.test(id);
    },
    {
      message: "Invalid MongoDB ObjectId (Chat ID)",
    }
  ),
  receiverId: z.string().refine(
    (id) => {
      return /^[0-9a-f]{24}$/.test(id);
    },
    {
      message: "Invalid MongoDB ObjectId (Receiver ID)",
    }
  ),
});
