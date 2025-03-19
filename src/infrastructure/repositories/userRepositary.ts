import { User } from "../../domain/entities/user";
import { IuserRepository } from "../../domain/interfaces/Iuserrepository";
import { UserChat } from "../database/mongodb/schema/user.schema";

export class UserRepository implements IuserRepository {
  async create(user: User): Promise<User> {
    try {
      const newUser = UserChat.build(user);
      return await newUser.save();
    } catch (error: any) {
      //   customLogger.error(`db error: ${error.message }`);
      throw new Error(`db error: ${error.message}`);
    }
  }
  async update(
    _id: string,
    data: { name?: string; avatar?: string; status?: string }
  ): Promise<User | null> {
    try {      
      const updatedUser = await UserChat.findByIdAndUpdate(_id, { $set: data });
      return updatedUser || null;
    } catch (error: any) {
      throw new Error(`Faild to update: ${error.message}`);
    }
  }
}
