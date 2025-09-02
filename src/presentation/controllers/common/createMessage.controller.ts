import { NextFunction, Request, Response } from "express";
import { ICreateMessageUseCase } from "../../../application/interface/common/ICreateMessageUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class CreateMessageController {
  constructor(private _createMessageUseCase: ICreateMessageUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this._createMessageUseCase.execute(
        { ...req.body },
        req.file
      );

      res.status(HttpStatusCode.OK).json({ message });
    } catch (error) {
      next(error);
    }
  };
}
