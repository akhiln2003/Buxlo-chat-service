// import mongoose from "mongoose";

// interface UserAttr {
//   _id:string,
//   name: string;
//   email: string;
//   role:string
//   avatar?: string;
//   isGoogle: boolean;
// }

// interface UserDoc extends mongoose.Document {
//   _id:string,
//   name: string;
//   email: string;
//   avatar?: string;
//   isGoogle: boolean;
//   role: "user" | "mentor" | 'admin';
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Mongoose Model with a custom build method
// interface UserModel extends mongoose.Model<UserDoc> {
//   build(attributes: UserAttr): UserDoc;
// }

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       require: true
//     },
//     avatar: {
//       type: String
//     },
//     isGoogle:{
//       type: Boolean,
//       default: false,
//       required: true
//     },
//     role: {
//       type: String,
//       required: true,
//       enum: ["user", "mentor" , "admin"],
//     }
//   },
//   {
//     toJSON: {
//       transform(_, ret) {
//         ret.id = ret._id;
//         delete ret._id;
//         delete ret.__v;
//       }
//     },
//     timestamps: true
//   }
// );

// // Attach the `build` method to the schema's static methods
// userSchema.statics.build = (attrs: UserAttr) => {
//   return new UserProfile(attrs); // Return a new User instance
// };

// const UserProfile = mongoose.model<UserDoc, UserModel>("User", userSchema);

// export { UserProfile };
