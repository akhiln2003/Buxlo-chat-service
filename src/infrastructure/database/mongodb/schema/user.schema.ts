import mongoose from "mongoose";

interface UserAttributes {
  name: string;
  email: string;
  role: "user" | "mentor" | "admin";
  status: boolean;
  avatar?: string;
}

interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  avatar?: string;
  status: boolean;
  role: "user" | "mentor" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
    },

    role: {
      type: String,
      required: true,
      enum: ["user", "mentor", "admin"],
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

userSchema.statics.build = (attrs: UserAttributes) => {
  return new UserChat(attrs);
};

const UserChat = mongoose.model<UserDocument, UserModel>(
  "UserChat",
  userSchema
);
export { UserChat };
