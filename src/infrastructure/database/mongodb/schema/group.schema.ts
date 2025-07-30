import mongoose from "mongoose";

interface GroupAttributes {
  name: string;
  email: string;
  avatar?: string;
}

interface GroupDocument extends mongoose.Document {
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GroupModel extends mongoose.Model<GroupDocument> {
  build(attributes: GroupAttributes): GroupDocument;
}

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
   {
    toJSON: {
      transform(_: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    timestamps: true
  }
);

groupSchema.statics.build = (attrs: GroupAttributes) => {
  return new UserChat(attrs);
};

const UserChat = mongoose.model<GroupDocument, GroupModel>(
  "GroupChat",
  groupSchema
);

export { UserChat };
