import { User } from "../../domain/entities/user.entity";

export interface IUserRepository {
  create(user: User): Promise<User>;
  update(
    _id: string,
    data: { name?: string; avatar?: string; status?: string }
  ): Promise<User | null>;
}
