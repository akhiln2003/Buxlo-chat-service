import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { ConnectMentorController } from "../controllers/user/connectMentor.Controller";
import { validateReqBody, validateReqQueryParams } from "@buxlo/common";
import { connectMentorDto } from "../../zodSchemaDto/user/connectMentor.dto";
import { fetchContactsDto } from "../../zodSchemaDto/user/fetchContacts.dto";
import { FetchContactsController } from "../controllers/user/fetchContacts.Controller";

export class UserRouter {
  private _router: Router;
  private _diContainer: DIContainer;

  private _connectMentorController!: ConnectMentorController;
  private _fetchContactsController!: FetchContactsController;
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
    this._fetchContactsController = new FetchContactsController(
      this._diContainer.fetchContactsUseCase()
    );
  }

  private _initializeRoutes(): void {
    this._router.post(
      "/connectmentor",
      validateReqBody(connectMentorDto),
      this._connectMentorController.connect
    );
    this._router.get(
      "/fetchcontacts",
      validateReqQueryParams(fetchContactsDto),
      this._fetchContactsController.contacts
    );
  }

  public getRouter(): Router {
    return this._router;
  }
}
