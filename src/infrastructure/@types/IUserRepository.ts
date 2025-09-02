import { User } from "../../domain/entities/user";

export interface IUserRepository {
  create(user: User): Promise<User>;
  update(
    _id: string,
    data: { name?: string; avatar?: string; status?: string }
  ): Promise<User | null>;
}
