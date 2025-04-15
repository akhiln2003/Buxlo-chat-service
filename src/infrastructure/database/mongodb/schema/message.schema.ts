import mongoose from "mongoose";

interface MessageAttributes {
  chatId: string; 
  senderId: string; 
  receiverId: string; 
  content: string;
  contentType: "text" | "image" | "video" | "audio"  ;
  status: "sent" | "delivered" | "received" | "read"; 
  deleted?: "me" | "everyone"; 
  replyTo?: string; 
}

interface MessageDocument extends mongoose.Document {
  chatId: string; 
  senderId: string; 
  receiverId: string; 
  content: string;
  contentType: "text" | "image" | "video" | "audio"  ;
  status: "sent" | "delivered" | "received" | "read"; 
  deleted?: "me" | "everyone"; 
  replyTo?: string; 
  createdAt: Date; 
  updatedAt: Date; 
}

interface MessageModel extends mongoose.Model<MessageDocument> {
  build(attributes: MessageAttributes): MessageDocument;
}

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: String,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: String,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["text", "image", "video", "audio", ], 
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "received", "read"], // Allowed statuses
      default: "sent",
    },
    deleted: {
      type: String,
      enum:["me","everyone"]      
    },
    replyTo: {
      type: String,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Static method to create a new message
messageSchema.statics.build = (attrs: MessageAttributes) => {
  return new MessageSchema(attrs);
};

const MessageSchema = mongoose.model<MessageDocument, MessageModel>("Message", messageSchema);

export { MessageSchema };