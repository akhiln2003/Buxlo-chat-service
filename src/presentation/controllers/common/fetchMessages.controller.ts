import { NextFunction, Request, Response } from "express";
import { IFetchMessagesUseCase } from "../../../application/interface/common/IFetchMessagesUserCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { BadRequest } from "@buxlo/common";

export class FetchMessagesController {
  constructor(private _fetchMessagesUseCase: IFetchMessagesUseCase) {}
  fetch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, receiverId } = req.query;
      if (!id) {
        throw new BadRequest("ID is required");
      }
      const messages = await this._fetchMessagesUseCase.execute(
        id as string,
        receiverId as string
      );
      res.status(HttpStatusCode.OK).json({ messages });
    } catch (error) {
      next(error);
    }
  };
}
