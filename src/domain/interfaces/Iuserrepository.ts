import { User } from "../entities/user";

export interface IuserRepository {
  create(user: User): Promise<User>;
  update(_id: string, data: { name?: string; avatar?: string , status?:string }): Promise<User | null>;

}
