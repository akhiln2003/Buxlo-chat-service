import { IcreateMessageUseCase } from "../../application/interface/common/IcreateMessageUseCase";
import { IfetchDataFromS3UseCase } from "../../application/interface/common/IfetchDataFromS3UseCase";
import { IfetchMessagesUseCase } from "../../application/interface/common/IfetchMessagesUserCase";
import { IconnectMentorUseCase } from "../../application/interface/user/IconnectMentorUseCase";
import { IfetchContactsUseCase } from "../../application/interface/user/IfetchContactsUseCase";
import { CreateMessageUseCase } from "../../application/usecase/common/createMessages.UseCase";
import { FetchDataFromS3UseCase } from "../../application/usecase/common/fetchDataFromS3.UseCase";
import { FetchMessagesUsesCase } from "../../application/usecase/common/fetchMessage.UseCase";
import { ConnectMentorUseCase } from "../../application/usecase/user/connectMentorUseCase";
import { FetchContactsUseCase } from "../../application/usecase/user/fetchContactsUseCase";
import { IchatRepository } from "../@types/IchatRepository";
import { ImessageRepository } from "../@types/ImessageRepository";
import { Is3Service } from "../@types/Is3Service";
import { S3Service } from "../external-services/s3-client";
import { ChatRepository } from "../repositories/chat.Repository";
import { MessageRepository } from "../repositories/message.Repository";

export class DIContainer {
  private _s3Service: Is3Service;
  private _chatRepo: IchatRepository;
  private _messageRepo: ImessageRepository;
  constructor() {
    this._s3Service = new S3Service();
    this._chatRepo = new ChatRepository();
    this._messageRepo = new MessageRepository();
  }

  connectMentorUseCase(): IconnectMentorUseCase {
    return new ConnectMentorUseCase(this._chatRepo);
  }

  fetchContactsUseCase(): IfetchContactsUseCase {
    return new FetchContactsUseCase(this._chatRepo , this._messageRepo);
  }

  createMessageUseCase(): IcreateMessageUseCase {
    return new CreateMessageUseCase(this._messageRepo , this._s3Service);
  }

  fetchMessagesUseCase(): IfetchMessagesUseCase {
    return new FetchMessagesUsesCase(this._messageRepo);
  }
  fetchDataFromS3UseCase():IfetchDataFromS3UseCase{
    return new FetchDataFromS3UseCase(this._s3Service);
  }
}
