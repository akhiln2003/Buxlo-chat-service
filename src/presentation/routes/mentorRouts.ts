import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";

export class MentorRouts {
  private _router: Router;
  private _diContainer: DIContainer;
  constructor() {
    this._router = Router();
    this._diContainer = new DIContainer();
    this.initializeControllers();
    this.initializeRoutes();

  }

  private initializeControllers():void{
    
  }

  private initializeRoutes():void{
    // this.router.post('')
  }
}
