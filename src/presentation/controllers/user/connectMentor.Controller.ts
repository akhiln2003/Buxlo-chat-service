import { Request, Response } from "express-serve-static-core";
import { IConnectMentorUseCase } from "../../../application/interface/user/IConnectMentorUseCase";
import { NextFunction } from "express";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class ConnectMentorController {
  constructor(private _connectMentorUseCase: IConnectMentorUseCase) {}

  connect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, mentorId } = req.body;
      const chat = await this._connectMentorUseCase.execute(userId, mentorId);

      res.status(HttpStatusCode.OK).json({ chat });
    } catch (error) {
      next(error);
    }
  };
}
