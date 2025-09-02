import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { NextFunction, Request, Response } from "express";
import { IFetchContactsUseCase } from "../../../application/interface/common/IFetchContactsUseCase";

export class FetchContactsController {
  constructor(private _fetchContactsUseCase: IFetchContactsUseCase) {}
  contacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      const constats = await this._fetchContactsUseCase.execute(id as string);
      res.status(HttpStatusCode.OK).json({ constats });
    } catch (error) {
      next(error);
    }
  };
}
