import { IconnectMentorUseCase } from "../../application/interface/user/IconnectMentorUseCase";
import { ConnectMentorUseCase } from "../../application/usecase/user/connectMentorUseCase";
import { IchatRepository } from "../../domain/interfaces/IchatRepository";
import { ChatRepository } from "../repositories/chatRepositary";

export class DIContainer {
  // private _s3Service: Is3Service;
  private _chatRepo: IchatRepository;
  constructor() {
    // this._s3Service = new S3Service();
    this._chatRepo = new ChatRepository();
  }

  connectMentorUseCase(): IconnectMentorUseCase {
    return new ConnectMentorUseCase(this._chatRepo);
  }
}
