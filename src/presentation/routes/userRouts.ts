import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";


const router = Router();


const diContainer = new DIContainer();

// Inject dependencies into the Controller



/////////////////////////////////////

export { router as userRoutes };
