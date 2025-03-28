import { NextFunction, Request, Response } from "express";
import { IfetchMessagesUseCase } from "../../../application/interface/common/IfetchMessagesUserCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class FetchMessagesController {
  constructor(private fetchMessagesUseCase: IfetchMessagesUseCase) {}
  fetch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const messages = await this.fetchMessagesUseCase.execute(id);
      res.status(HttpStatusCode.OK).json({ messages });
    } catch (error) {
      next(error);
    }
  };
}
