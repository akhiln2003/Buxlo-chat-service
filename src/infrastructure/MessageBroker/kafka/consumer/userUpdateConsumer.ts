import { KafkaConsumer, UserUpdatedEvent } from "@buxlo/common";
import { Topics } from "@buxlo/common/build/events/topics";
import { Consumer, KafkaMessage } from "kafkajs";
import { UserRepository } from "../../../repositories/user.Repository";

export class UserUpdatedConsumer extends KafkaConsumer<UserUpdatedEvent> {
  topic: Topics.userUpdated = Topics.userUpdated;

  constructor(consumer: Consumer) {
    super(consumer);
  }

  async onConsume(
    data: UserUpdatedEvent["data"],
    msg: KafkaMessage
  ): Promise<void> {
    try {
      const userRepository = new UserRepository();
      await userRepository.update(data.id, data.query);
      console.log("user updated successfully");
    } catch (error) {
      console.log("error in updating user", error);
    }
  }
}
