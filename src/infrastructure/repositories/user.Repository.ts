import { User } from "../../domain/entities/user";
import {
  UserMapper,
  UserResponseDto,
} from "../../zodSchemaDto/output/userResponse.dto";
import { IuserRepository } from "../@types/IuserRepository";
import { UserChat } from "../database/mongodb/schema/user.schema";

export class UserRepository implements IuserRepository {
  async create(user: User): Promise<UserResponseDto> {
    try {
      const newUser = UserChat.build(user);
      const newData = await newUser.save();
      return UserMapper.toDto(newData);
    } catch (error: any) {
      //   customLogger.error(`db error: ${error.message }`);
      throw new Error(`db error: ${error.message}`);
    }
  }
  async update(
    _id: string,
    data: { name?: string; avatar?: string; status?: string }
  ): Promise<UserResponseDto | null> {
    try {
      const updatedUser = await UserChat.findByIdAndUpdate(
        _id,
        { $set: data },
        { new: true, lean: true } // return updated doc
      );

      return updatedUser ? UserMapper.toDto(updatedUser) : null;
    } catch (error: any) {
      throw new Error(`Failed to update: ${error.message}`);
    }
  }
}
