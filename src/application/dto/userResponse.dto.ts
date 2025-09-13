import { z } from "zod";
import { User } from "../../domain/entities/user.entity";

export const UserResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.string(),
  status: z.boolean(),
});

export type UserResponseDto = z.infer<typeof UserResponseDto>;
interface IUser extends User {
  _id?: string;
}
export class UserMapper {
  static toDto(user: IUser): UserResponseDto {
    return UserResponseDto.parse({
      id: user.id ?? user._id?.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
    });
  }
}
