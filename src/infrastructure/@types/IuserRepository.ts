import { User } from "../../domain/entities/user";
import { UserResponseDto } from "../../zodSchemaDto/output/userResponse.dto";

export interface IuserRepository {
  create(user: User): Promise<UserResponseDto>;
  update(
    _id: string,
    data: { name?: string; avatar?: string; status?: string }
  ): Promise<UserResponseDto | null>;
}
