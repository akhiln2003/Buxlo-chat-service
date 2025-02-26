import { errorHandler } from "@buxlo/common";
import { Iserver } from "./domain/interfaces/Iserver";
import {
  connectDB,
  disconnectDB,
} from "./infrastructure/database/mongodb/connection";

import loggerMiddleware from "./presentation/middlewares/loggerMiddleware";
import { mentorRoutes } from "./presentation/routes/mentorRouts";
import { userRoutes } from "./presentation/routes/userRouts";


export class App {
  constructor(private server: Iserver) {}

  async initialize(): Promise<void> {
    this.registerMiddleware();
    this.registerRoutes();
    this.registerErrorHandler();
    await this.connectDB();
  }

  private registerMiddleware(): void {
    this.server.registerMiddleware(loggerMiddleware);
  }
  private registerRoutes(): void {
    this.server.registerRoutes("/api/user/mentor", mentorRoutes);
    this.server.registerRoutes("/api/user/user", userRoutes);

  }

  private registerErrorHandler(): void {
    this.server.registerErrorHandler(errorHandler as any);
  }

  async start(port: number): Promise<void> {
    await this.server.start(port);
  }

  async shutdown(): Promise<void> {
    await disconnectDB();
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


}
