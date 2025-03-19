import { KafkaConsumer, UserCreatedEvent } from "@buxlo/common";
import { Topics } from "@buxlo/common/build/events/topics";
import { Consumer, KafkaMessage } from "kafkajs";
import { UserRepository } from "../../../repositories/userRepositary";

export class UserCreatedConsumer extends KafkaConsumer<UserCreatedEvent> {
  topic: Topics.userCreated = Topics.userCreated;

  constructor(consumer: Consumer) {
    super(consumer);
  }

  async onConsume(
    data: UserCreatedEvent["data"],
    msg: KafkaMessage
  ): Promise<void> {
    try {      
      const userRepository = new UserRepository();
      const user = {
        _id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        status: true,
        avatar: data.avatar,
      };
      await userRepository.create(user);
      console.log("user updated successfully", data);
    } catch (error) {
      console.log("error in updating user", error);
    }
  }
}
