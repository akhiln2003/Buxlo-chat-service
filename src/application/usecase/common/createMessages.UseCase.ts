import { InternalServerError } from "@buxlo/common";
import { Message } from "../../../domain/entities/message";
import { ImessageRepository } from "../../../infrastructure/@types/ImessageRepository";
import { IcreateMessageUseCase } from "../../interface/common/IcreateMessageUseCase";

export class CreateMessageUseCase implements IcreateMessageUseCase {
  constructor(private messageRepo: ImessageRepository) {}
  async execute(message: Message): Promise<Message | null> {
    try {
      return await this.messageRepo.create(message);
    } catch (error) {
      console.error("Error wile connect mentor : ", error);
      throw new InternalServerError();
    }
  }
}
