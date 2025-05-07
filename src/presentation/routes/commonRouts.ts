import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { fetchMessagesDto } from "../../zodSchemaDto/user/fetchMessages.dto";
import { FetchMessagesController } from "../controllers/common/fetchMessages.controller";
import { validateReqQueryParams } from "@buxlo/common";
import { CreateMessageController } from "../controllers/common/createMessage.controller";
import { FetchDataFromS3Controller } from "../controllers/common/fetchDataFromS3.controller";
import multer from "multer";

export class CommonRouts {
  private router: Router;
  private diContainer: DIContainer;
  private upload = multer({ storage: multer.memoryStorage() });

  private fetchMessagesController!: FetchMessagesController;
  private createMessageController!: CreateMessageController;
  private fetchDataFromS3Controller!: FetchDataFromS3Controller;

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
    this.fetchDataFromS3Controller = new FetchDataFromS3Controller(
      this.diContainer.fetchDataFromS3UseCase()
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
    this.router.post("/fetchmessagefroms3", this.fetchDataFromS3Controller.get);
  }

  public getRouter(): Router {
    return this.router;
  }
}
