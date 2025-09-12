import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../@types/IUserRepository";
import { UserChat } from "../database/mongodb/schema/user.schema";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const newUser = UserChat.build(user);
      return await newUser.save();
    } catch (error: any) {
      throw new Error(`db error: ${error.message}`);
    }
  }
  async update(
    _id: string,
    data: { name?: string; avatar?: string; status?: string }
  ): Promise<User | null> {
    try {
      const updatedUser = await UserChat.findByIdAndUpdate(
        _id,
        { $set: data },
        { new: true, lean: true }
      );

      return updatedUser ? updatedUser : null;
    } catch (error: any) {
      throw new Error(`Failed to update: ${error.message}`);
    }
  }
}
