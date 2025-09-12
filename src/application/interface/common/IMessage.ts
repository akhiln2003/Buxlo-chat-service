export interface IMessageData {
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  contentType: "text" | "image" | "video" | "audio" | "document";
  status: "sent" | "delivered" | "received" | "read";
  deleted?: "me" | "everyone";
  replyTo?: string;
}
