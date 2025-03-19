import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { ConnectMentorController } from "../controllers/user/connectMentor.Controller";
import { validateReqBody } from "@buxlo/common";
import { connectMentorDto } from "../../zodSchemaDto/user/connectMentor.dto";

export class UserRouter {
  private router: Router;
  private diContainer: DIContainer;

  private connectMentorController!: ConnectMentorController;
  constructor() {
    this.router = Router();
    this.diContainer = new DIContainer();
    this.initializeControllers();
    this.initializeRoutes();
  }

  private initializeControllers(): void {
    this.connectMentorController = new ConnectMentorController(
      this.diContainer.connectMentorUseCase()
    );
  }

  private initializeRoutes(): void {
    this.router.post(
      "/connectmentor",
      validateReqBody(connectMentorDto),
      this.connectMentorController.connect
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
