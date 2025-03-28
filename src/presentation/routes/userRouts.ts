import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { ConnectMentorController } from "../controllers/user/connectMentor.Controller";
import { validateReqBody, validateReqQueryParams } from "@buxlo/common";
import { connectMentorDto } from "../../zodSchemaDto/user/connectMentor.dto";
import { fetchContactsDto } from "../../zodSchemaDto/user/fetchContacts.dto";
import { FetchContactsController } from "../controllers/user/fetchContacts.Controller";

export class UserRouter {
  private router: Router;
  private diContainer: DIContainer;

  private connectMentorController!: ConnectMentorController;
  private fetchContactsController!: FetchContactsController;
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
    this.fetchContactsController = new FetchContactsController(
      this.diContainer.fetchContactsUseCase()
    );
  }

  private initializeRoutes(): void {
    this.router.post(
      "/connectmentor",
      validateReqBody(connectMentorDto),
      this.connectMentorController.connect
    );
    this.router.get(
      "/fetchcontacts",
      validateReqQueryParams(fetchContactsDto),
      this.fetchContactsController.contacts
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
