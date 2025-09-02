import { ICreateMessageUseCase } from "../../application/interface/common/ICreateMessageUseCase";
import { IFetchDataFromS3UseCase } from "../../application/interface/common/IFetchDataFromS3UseCase";
import { IFetchMessagesUseCase } from "../../application/interface/common/IFetchMessagesUserCase";
import { IConnectMentorUseCase } from "../../application/interface/user/IConnectMentorUseCase";
import { IFetchContactsUseCase } from "../../application/interface/common/IFetchContactsUseCase";
import { CreateMessageUseCase } from "../../application/usecase/common/createMessages.UseCase";
import { FetchDataFromS3UseCase } from "../../application/usecase/common/fetchDataFromS3.UseCase";
import { FetchMessagesUsesCase } from "../../application/usecase/common/fetchMessage.UseCase";
import { ConnectMentorUseCase } from "../../application/usecase/user/connectMentorUseCase";
import { FetchContactsUseCase } from "../../application/usecase/common/fetchContactsUseCase";
import { IChatRepository } from "../@types/IChatRepository";
import { IMessageRepository } from "../@types/IMessageRepository";
import { IS3Service } from "../@types/IS3Service";
import { S3Service } from "../external-services/s3-client";
import { ChatRepository } from "../repositories/chat.Repository";
import { MessageRepository } from "../repositories/message.Repository";

export class DIContainer {
  private _s3Service: IS3Service;
  private _chatRepo: IChatRepository;
  private _messageRepo: IMessageRepository;
  constructor() {
    this._s3Service = new S3Service();
    this._chatRepo = new ChatRepository();
    this._messageRepo = new MessageRepository();
  }

  connectMentorUseCase(): IConnectMentorUseCase {
    return new ConnectMentorUseCase(this._chatRepo);
  }

  fetchContactsUseCase(): IFetchContactsUseCase {
    return new FetchContactsUseCase(this._chatRepo , this._messageRepo);
  }

  createMessageUseCase(): ICreateMessageUseCase {
    return new CreateMessageUseCase(this._messageRepo , this._s3Service);
  }

  fetchMessagesUseCase(): IFetchMessagesUseCase {
    return new FetchMessagesUsesCase(this._messageRepo);
  }
  fetchDataFromS3UseCase():IFetchDataFromS3UseCase{
    return new FetchDataFromS3UseCase(this._s3Service);
  }
}
