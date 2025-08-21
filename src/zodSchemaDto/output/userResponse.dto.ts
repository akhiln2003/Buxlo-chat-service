import { z } from "zod";

export const UserResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.string(),
  status: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserResponseDto = z.infer<typeof UserResponseDto>;

export class UserMapper {
  static toDto(user: any): UserResponseDto {
    return UserResponseDto.parse({
      id: user._id?.toString() ?? user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    });
  }
}
