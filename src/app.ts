import { errorHandler } from "@buxlo/common";
import { Iserver } from "./domain/interfaces/Iserver";
import {
  connectDB,
  disconnectDB,
} from "./infrastructure/database/mongodb/connection";

import loggerMiddleware from "./presentation/middlewares/loggerMiddleware";
// import { mentorRoutes } from "./presentation/routes/mentorRouts";
// import { userRoutes } from "./presentation/routes/userRouts";
import { messageBroker } from "./infrastructure/MessageBroker/config";
import { UserRouter } from "./presentation/routes/userRouts";


export class App {
  constructor(private server: Iserver) {}

  async initialize(): Promise<void> {
    await this.connectDB();
    await this.connectKafka();
    this.registerMiddleware();
    this.registerRoutes();
    this.registerErrorHandler();

  }

  private registerMiddleware(): void {
    this.server.registerMiddleware(loggerMiddleware);
  }
  private registerRoutes(): void {
    const userRoutes = new UserRouter().getRouter();
    // const mentorRoutes = new MentorRouter().getRouter();
    this.server.registerRoutes("/api/chat/user", userRoutes);
    // this.server.registerRoutes("/api/auth/mentor", mentorRoutes);

  }

  private registerErrorHandler(): void {
    this.server.registerErrorHandler(errorHandler as any);
  }

  async start(port: number): Promise<void> {
    await this.server.start(port);
  }

  async shutdown(): Promise<void> {
    await disconnectDB();
    await messageBroker.disconnect();
    console.log("Shut dow server");
  }
  private async connectDB() {
    try {
      await connectDB();
    } catch (error) {
      console.log("Server could not be started", error);
      process.exit(1);
    }
  }
  private async connectKafka(): Promise<void> {
    await messageBroker.connect();
  }


}
