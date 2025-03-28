export class Message {
  constructor(
    public chatId: string,
    public senderId: string,
    public receiverId: string,
    public content: string,
    public contentType: "text" | "image" | "video" | "audio" | "emoji",
    public status: "sent" | "delivered" | "received" | "read",
    public deleted?: "me" | "everyone",
    public replyTo?: string,
    public id?: string
  ) {}
}
