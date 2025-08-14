import { KafkaClient } from "@buxlo/common";
import { UserCreatedConsumer } from "./kafka/consumer/userCreatedConsumer";
import { UserUpdatedConsumer } from "./kafka/consumer/userUpdateConsumer";

class MessageBroker {
  private _kafka: KafkaClient;
  constructor() {
    this._kafka = new KafkaClient();
  }

  async connect() {
    const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092";
    const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "chat-service";
    const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || "chat-group";
    await this._kafka.connect(KAFKA_CLIENT_ID, [KAFKA_BROKER], KAFKA_GROUP_ID);
    this._setupConsumers();
  }

  async disconnect() {
    try {
      console.log("Disconnecting from Kafka...");
      await this._kafka.disconnect();
      console.log("Disconnected from Kafka");
    } catch (error) {
      console.error("Error while disconnecting from Kafka:", error);
    }
  }

  private _setupConsumers() {
    const userCreated = this._kafka.getConsumer("userUpdated");
    new UserCreatedConsumer(this._kafka.consumer).listen();

    if( userCreated){
    new UserUpdatedConsumer( userCreated  ).listen();

    }
  }

  getKafkaClient() {
    return this._kafka;
  }
}

export const messageBroker = new MessageBroker();
