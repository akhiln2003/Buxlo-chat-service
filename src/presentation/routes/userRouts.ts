import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { ConnectMentorController } from "../controllers/user/connectMentor.Controller";
import { validateReqBody } from "@buxlo/common";
import { connectMentorDto } from "../../domain/zodSchemaDto/input/user/connectMentor.dto";

export class UserRouter {
  private _router: Router;
  private _diContainer: DIContainer;

  private _connectMentorController!: ConnectMentorController;
  constructor() {
    this._router = Router();
    this._diContainer = new DIContainer();
    this._initializeControllers();
    this._initializeRoutes();
  }

  private _initializeControllers(): void {
    this._connectMentorController = new ConnectMentorController(
      this._diContainer.connectMentorUseCase()
    );
  }

  private _initializeRoutes(): void {
    this._router.post(
      "/connectmentor",
      validateReqBody(connectMentorDto),
      this._connectMentorController.connect
    );
  }

  public getRouter(): Router {
    return this._router;
  }
}
