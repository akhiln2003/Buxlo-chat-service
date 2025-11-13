import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { IMessageRepository } from "../@types/IMessageRepository";
import { MessageRepository } from "../repositories/message.Repository";

export class SocketServer {
  private _io: Server;
  private _online: Map<string, string> = new Map();
  private _activeCalls: Map<string, string> = new Map(); // Track active calls
  private _messageRepo: IMessageRepository;

  constructor(httpServer: HttpServer) {
    const allowedOrigins = process.env.FRONT_END_BASE_URL!.split(",");

    this._messageRepo = new MessageRepository();
    this._io = new Server(httpServer, {
      cors: {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST"],
      },
      path: "/socket.io",
    });
    this.setupListeners();
  }

  private _handleConnection(socket: Socket): void {
    console.log(`User connected: ${socket.id}`);
    this._setupSocketListeners(socket);
  }

  private _handleDisconnect(socket: Socket): void {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of this._online.entries()) {
      if (socketId === socket.id) {
        const callPartner = this._activeCalls.get(userId);
        if (callPartner) {
          const partnerSocketId = this._online.get(callPartner);
          if (partnerSocketId) {
            socket.to(partnerSocketId).emit("end-call", { from: userId });
          }
          this._activeCalls.delete(userId);
          this._activeCalls.delete(callPartner);
        }
        break;
      }
    }
  }

  private _handleStatus(socket: Socket, data: any): void {
    const { userId, receiverId } = data;
    socket.to(`${userId}${receiverId}`).emit("status", data);
  }

  private _handleDirectMessage(socket: Socket, data: any): void {
    if (!data.receiverId) {
      console.error("Direct message missing receiverId");
      return;
    }
    const { senderId, receiverId } = data;
    socket.to(`${receiverId}${senderId}`).emit("direct_message", data);
  }

  private _handleChatUpdated(socket: Socket, data: any) {
    const userSocketId = this._online.get(data.receiverId);
    if (userSocketId) socket.to(userSocketId).emit("chat_updated", data);
  }

  private async _handleMarkMessagesRead(socket: Socket, data: any) {
    const { chatId, receiverId, userId } = data;
    if (chatId && receiverId) {
      this._messageRepo.updateMessage(chatId, receiverId);
      const otherUserSocketId = this._online.get(userId);
      if (otherUserSocketId) {
        socket.to(otherUserSocketId).emit("messages_marked_read");
      }
    }
  }

  private _handleJoin(
    socket: Socket,
    userId: string,
    receiverId: string
  ): void {
    socket.join(`${userId}${receiverId}`);
  }

  private _handleOnline(socket: Socket, userId: string): void {
    this._online.set(userId, socket.id);
    this._io.emit("online", { userId });
  }

  private _handleActiveUser(socket: Socket): void {
    const keysIterator = this._online.keys();
    socket.emit("active_user", Array.from(keysIterator));
  }

  private _handleCallUser(socket: Socket, data: any): void {
    const { to, offer, from, name, avatar } = data;
    if (this._activeCalls.has(from) || this._activeCalls.has(to)) {
      socket.emit("call_rejected", { reason: "User is already in a call" });
      return;
    }
    const receiverSocketId = this._online.get(to);
    if (!receiverSocketId) {
      socket.emit("call_rejected", { reason: "User is offline" });
      return;
    }
    this._activeCalls.set(from, to);
    this._activeCalls.set(to, from);
    socket.to(receiverSocketId).emit("incoming_call", {
      from,
      offer,
      name,
      avatar,
    });
  }

  private _handleAnswerCall(socket: Socket, data: any): void {
    const { to, answer, from } = data;
    const callerSocketId = this._online.get(to);
    if (callerSocketId)
      socket.to(callerSocketId).emit("call_accepted", { from, answer });
  }

  private _handleIceCandidate(socket: Socket, data: any): void {
    const { to, candidate, from } = data;
    const targetSocketId = this._online.get(to);
    if (targetSocketId)
      socket.to(targetSocketId).emit("ice-candidate", { from, candidate });
  }

  private _handleCallRejected(socket: Socket, data: any) {
    const { from, to } = data;
    this._activeCalls.delete(from);
    this._activeCalls.delete(to);
    const callerSocketId = this._online.get(to);
    if (callerSocketId)
      socket.to(callerSocketId).emit("call_rejected", { from });
  }
  private _handleWebrtcOffer(socket: Socket, data: any): void {
    const { to, offer } = data;
    const otherUserSocketId = this._online.get(to);
    if (otherUserSocketId)
      socket.to(otherUserSocketId).emit("webrtc-offer", { offer });
  }
  private _handleAnswerWebrtc(socket: Socket, data: any): void {
    const { to, answer } = data;
    const otherUserSocketId = this._online.get(to);
    if (otherUserSocketId)
      socket.to(otherUserSocketId).emit("webrtc-answer", { answer });
  }

  private _handleEndCall(socket: Socket, data: any): void {
    const { from, to } = data;
    this._activeCalls.delete(from);
    this._activeCalls.delete(to);
    const otherUserSocketId = this._online.get(to);
    if (otherUserSocketId)
      socket.to(otherUserSocketId).emit("end-call", { from });
  }
  private _handleLeave(socket: Socket, userId: string): void {
    const callPartner = this._activeCalls.get(userId);
    if (callPartner) {
      const partnerSocketId = this._online.get(callPartner);
      if (partnerSocketId)
        socket.to(partnerSocketId).emit("end-call", { from: userId });
      this._activeCalls.delete(userId);
      this._activeCalls.delete(callPartner);
    }
    socket.leave(userId);
    this._online.delete(userId);
    this._io.emit("leave", userId);
  }

  private _setupSocketListeners(socket: Socket): void {
    socket.on("status", (data) => this._handleStatus(socket, data));
    socket.on("direct_message", (data) =>
      this._handleDirectMessage(socket, data)
    );
    socket.on("chat_updated", (data) => this._handleChatUpdated(socket, data));
    socket.on(
      "join",
      ({ userId, receiverId }: { userId: string; receiverId: string }) =>
        this._handleJoin(socket, userId, receiverId)
    );
    socket.on("mark_messages_read", (data) =>
      this._handleMarkMessagesRead(socket, data)
    );
    socket.on("active_user", () => this._handleActiveUser(socket));
    socket.on("leave", (userId: string) => this._handleLeave(socket, userId));
    socket.on("online", (userId: string) => this._handleOnline(socket, userId));
    socket.on("disconnect", () => this._handleDisconnect(socket));
    socket.on("call-user", (data) => this._handleCallUser(socket, data));
    socket.on("answer-call", (data) => this._handleAnswerCall(socket, data));
    socket.on("webrtc-offer", (data) => this._handleWebrtcOffer(socket, data));
    socket.on("webrtc-answer", (data) =>
      this._handleAnswerWebrtc(socket, data)
    );
    socket.on("ice-candidate", (data) =>
      this._handleIceCandidate(socket, data)
    );
    socket.on("call-rejected", (data) =>
      this._handleCallRejected(socket, data)
    );
    socket.on("end-call", (data) => this._handleEndCall(socket, data));
  }
  private setupListeners(): void {
    this._io.on("connection", (socket: Socket) =>
      this._handleConnection(socket)
    );
  }
  public getIO(): Server {
    return this._io;
  }
}
