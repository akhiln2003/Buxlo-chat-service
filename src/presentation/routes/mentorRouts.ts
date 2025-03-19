import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";

export class MentorRouts {
  private router: Router;
  private diContainer: DIContainer;
  constructor() {
    this.router = Router();
    this.diContainer = new DIContainer();
    this.initializeControllers();
    this.initializeRoutes();

  }

  private initializeControllers():void{
    
  }

  private initializeRoutes():void{
    // this.router.post('')
  }
}
