import { NextFunction, Request, Response } from "express";
import { IcreateMessageUseCase } from "../../../application/interface/common/IcreateMessageUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class CreateMessageController {
  constructor(private createMessageUseCase: IcreateMessageUseCase) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.createMessageUseCase.execute(
        { ...req.body },
        req.file
      );

      res.status(HttpStatusCode.OK).json({ message });
    } catch (error) {
      next(error);
    }
  };
}
