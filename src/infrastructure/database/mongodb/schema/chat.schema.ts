import mongoose from "mongoose";

interface ChatAttributes {
  participants: string[];
  lastMessage?: string;
  unreadCount: number;
  type: "OneToOne" | "Group";
  name?: string;
  avatar?:string;
}

interface ChatDocument extends mongoose.Document {
  participants: string[];
  lastMessage?: string;
  unreadCount: number;
  type: "OneToOne" | "Group";
  name?: string;
  avatar?:string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatModel extends mongoose.Model<ChatDocument> {
  build(attributes: ChatAttributes): ChatDocument;
}

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: String,
        ref: "UserChat",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      ref: "Message",
      default: null,
    },
    type: {
      type: String,
      enum: ["OneToOne", "Group"],
      require: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Static method to create a new chat
chatSchema.statics.build = (attrs: ChatAttributes) => {
  return new ChatSchema(attrs);
};

const ChatSchema = mongoose.model<ChatDocument, ChatModel>("Chat", chatSchema);

export { ChatSchema };
