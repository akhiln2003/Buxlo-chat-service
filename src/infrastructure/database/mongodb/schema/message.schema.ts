import mongoose from "mongoose";

interface MessageAttributes {
  chatId: mongoose.Types.ObjectId; 
  senderId: mongoose.Types.ObjectId; 
  receiverId: mongoose.Types.ObjectId; 
  content: string;
  type: "text" | "image" | "video" | "audio" | "emoji" ;
  status: "sent" | "delivered" | "received" | "read"; 
  deletedForMe?: boolean; 
  deletedForEveryone?: boolean; 
  replyTo?: mongoose.Types.ObjectId; 
}

interface MessageDocument extends mongoose.Document {
  chatId: mongoose.Types.ObjectId; 
  senderId: mongoose.Types.ObjectId; 
  receiverId: mongoose.Types.ObjectId; 
  content: string;
  type: "text" | "image" | "video" | "audio" | "emoji" ;
  status: "sent" | "delivered" | "received" | "read"; 
  deletedForMe?: boolean; 
  deletedForEveryone?: boolean; 
  replyTo?: mongoose.Types.ObjectId; 
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
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "emoji"], 
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "received", "read"], // Allowed statuses
      default: "sent",
    },
    deletedForMe: {
      type: Boolean,
      default: false,
    },
    deletedForEveryone: {
      type: Boolean,
      default: false,
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
  return new Message(attrs);
};

const Message = mongoose.model<MessageDocument, MessageModel>("Message", messageSchema);

export { Message };