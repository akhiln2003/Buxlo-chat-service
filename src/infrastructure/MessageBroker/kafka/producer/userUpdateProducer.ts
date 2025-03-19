import { KafkaProducer, UserUpdatedEvent } from "@buxlo/common";
import { Topics } from "@buxlo/common/build/events/topics";

export class UserUpdatedProducer extends KafkaProducer<UserUpdatedEvent> {
    topic: Topics.userUpdated = Topics.userUpdated;
}