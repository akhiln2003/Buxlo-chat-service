import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { fetchMessagesDto } from "../../zodSchemaDto/user/fetchMessages.dto";
import { FetchMessagesController } from "../controllers/common/fetchMessages.controller";
import { validateReqQueryParams } from "@buxlo/common";
import { CreateMessageController } from "../controllers/common/createMessage.controller";
import { FetchDataFromS3Controller } from "../controllers/common/fetchDataFromS3.controller";
import multer from "multer";

export class CommonRouts {
  private _router: Router;
  private _diContainer: DIContainer;
  private _upload = multer({ storage: multer.memoryStorage() });

  private _fetchMessagesController!: FetchMessagesController;
  private _createMessageController!: CreateMessageController;
  private _fetchDataFromS3Controller!: FetchDataFromS3Controller;

  constructor() {
    this._router = Router();
    this._diContainer = new DIContainer();
    this._initializeControllers();
    this._initializeRoutes();
  }

  private _initializeControllers(): void {
    this._fetchMessagesController = new FetchMessagesController(
      this._diContainer.fetchMessagesUseCase()
    );
    this._createMessageController = new CreateMessageController(
      this._diContainer.createMessageUseCase()
    );
    this._fetchDataFromS3Controller = new FetchDataFromS3Controller(
      this._diContainer.fetchDataFromS3UseCase()
    );
  }

  private _initializeRoutes(): void {
    this._router.get(
      "/fetchmessages",
      validateReqQueryParams(fetchMessagesDto),
      this._fetchMessagesController.fetch
    );
    this._router.post(
      "/createmessage",
      //   validateReqBody(),
      this._upload.single("content"),
      this._createMessageController.create
    );
    this._router.post("/fetchmessagefroms3", this._fetchDataFromS3Controller.get);
  }

  public getRouter(): Router {
    return this._router;
  }
}
