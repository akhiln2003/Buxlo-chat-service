import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { NextFunction, Request, Response } from "express";
import { IfetchContactsUseCase } from "../../../application/interface/user/IfetchContactsUseCase";

export class FetchContactsController {
  constructor(private fetchContactsUseCase: IfetchContactsUseCase) {}
  contacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      const constats = await this.fetchContactsUseCase.execute(id as string);
      res.status(HttpStatusCode.OK).json({constats});
    } catch (error) {
      next(error);
    }
  };
}
