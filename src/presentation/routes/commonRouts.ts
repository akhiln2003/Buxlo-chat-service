import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { fetchMessagesDto } from "../../zodSchemaDto/user/fetchMessages.dto";
import { FetchMessagesController } from "../controllers/common/fetchMessages.controller";
import { validateReqQueryParams } from "@buxlo/common";
import { CreateMessageController } from "../controllers/common/createMessage.controller";
import multer from "multer";

export class CommonRouts {
  private router: Router;
  private diContainer: DIContainer;
  private upload = multer({ storage: multer.memoryStorage() });

  private fetchMessagesController!: FetchMessagesController;
  private createMessageController!: CreateMessageController;

  constructor() {
    this.router = Router();
    this.diContainer = new DIContainer();
    this.initializeControllers();
    this.initializeRoutes();
  }

  private initializeControllers(): void {
    this.fetchMessagesController = new FetchMessagesController(
      this.diContainer.fetchMessagesUseCase()
    );
    this.createMessageController = new CreateMessageController(
      this.diContainer.createMessageUseCase()
    );
  }

  private initializeRoutes(): void {
    this.router.get(
      "/fetchmessages",
      validateReqQueryParams(fetchMessagesDto),
      this.fetchMessagesController.fetch
    );
    this.router.post(
      "/createmessage",
      //   validateReqBody(),
      this.upload.single("content"),
      this.createMessageController.create
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
