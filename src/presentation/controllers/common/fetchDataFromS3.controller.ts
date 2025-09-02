import { NextFunction, Request, Response } from "express";
import { IFetchDataFromS3UseCase } from "../../../application/interface/common/IFetchDataFromS3UseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class FetchDataFromS3Controller {
  constructor(private _fetchDataFromS3UseCase: IFetchDataFromS3UseCase) {}
  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { keys } = req.body;
      const imageUrl = await this._fetchDataFromS3UseCase.execute(keys);
      res.status(HttpStatusCode.OK).json({ imageUrl });
    } catch (error) {
      next(error);
    }
  };
}
