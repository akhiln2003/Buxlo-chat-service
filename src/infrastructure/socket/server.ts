import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ImessageRepository } from "../@types/ImessageRepository";
import { MessageRepository } from "../repositories/message.Repository";

export class SocketServer {
  private io: Server;
  private online: Map<string, string> = new Map();
  private activeCalls: Map<string, string> = new Map(); // Track active calls
  private _messageRepo: ImessageRepository;

  constructor(httpServer: HttpServer) {
    this._messageRepo = new MessageRepository();
    this.io = new Server(httpServer, {
      cors: {
        origin: [process.env.CLIENT_URL as string, "http://localhost:5173"],
        methods: ["GET", "POST"],
      },
    });
    this.setupListeners();
  }

  private handleConnection(socket: Socket): void {
    console.log(`User connected: ${socket.id}`);
    this.setupSocketListeners(socket);
  }

  private handleDisconnect(socket: Socket): void {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of this.online.entries()) {
      if (socketId === socket.id) {
        const callPartner = this.activeCalls.get(userId);
        if (callPartner) {
          const partnerSocketId = this.online.get(callPartner);
          if (partnerSocketId) {
            socket.to(partnerSocketId).emit("end-call", { from: userId });
          }
          this.activeCalls.delete(userId);
          this.activeCalls.delete(callPartner);
        }
        break;
      }
    }
  }

  private handleStatus(socket: Socket, data: any): void {
    const { userId, receiverId } = data;
    socket.to(`${userId}${receiverId}`).emit("status", data);
  }

  private handleDirectMessage(socket: Socket, data: any): void {
    if (!data.receiverId) {
      console.error("Direct message missing receiverId");
      return;
    }
    const { senderId, receiverId } = data;
    socket.to(`${receiverId}${senderId}`).emit("direct_message", data);
  }

  private handleChatUpdated(socket: Socket, data: any) {
    const userSocketId = this.online.get(data.receiverId);
    if (userSocketId) socket.to(userSocketId).emit("chat_updated", data);
  }

  private async handleMarkMessagesRead(socket: Socket, data: any) {
    const { chatId, receiverId, userId } = data;
    if (chatId && receiverId) {
      this._messageRepo.updateMessage(chatId, receiverId);
      const otherUserSocketId = this.online.get(userId);
      if (otherUserSocketId) {
        socket.to(otherUserSocketId).emit("messages_marked_read");
      }
    }
  }

  private handleJoin(socket: Socket, userId: string, receiverId: string): void {
    socket.join(`${userId}${receiverId}`);
  }

  private handleOnline(socket: Socket, userId: string): void {
    this.online.set(userId, socket.id);
    this.io.emit("online", { userId });
  }

  private handleActiveUser(socket: Socket): void {
    const keysIterator = this.online.keys();
    socket.emit("active_user", Array.from(keysIterator));
  }

  private handleCallUser(socket: Socket, data: any): void {
    const { to, offer, from, name, avatar } = data;
    if (this.activeCalls.has(from) || this.activeCalls.has(to)) {
      socket.emit("call_rejected", { reason: "User is already in a call" });
      return;
    }
    const receiverSocketId = this.online.get(to);
    if (!receiverSocketId) {
      socket.emit("call_rejected", { reason: "User is offline" });
      return;
    }
    this.activeCalls.set(from, to);
    this.activeCalls.set(to, from);
    socket.to(receiverSocketId).emit("incoming_call", {
      from,
      offer,
      name,
      avatar,
    });
  }

  private handleAnswerCall(socket: Socket, data: any): void {
    const { to, answer, from } = data;
    const callerSocketId = this.online.get(to);
    if (callerSocketId)
      socket.to(callerSocketId).emit("call_accepted", { from, answer });
  }

  private handleIceCandidate(socket: Socket, data: any): void {
    const { to, candidate, from } = data;
    const targetSocketId = this.online.get(to);
    if (targetSocketId)
      socket.to(targetSocketId).emit("ice-candidate", { from, candidate });
  }

  private handleCallRejected(socket: Socket, data: any) {
    const { from, to } = data;
    this.activeCalls.delete(from);
    this.activeCalls.delete(to);
    const callerSocketId = this.online.get(to);
    if (callerSocketId)
      socket.to(callerSocketId).emit("call_rejected", { from });
  }
  private handleWebrtcOffer(socket: Socket, data: any): void {
    const { to, offer } = data;
    const otherUserSocketId = this.online.get(to);
    if (otherUserSocketId)
      socket.to(otherUserSocketId).emit("webrtc-offer", { offer });
  }
  private handleAnswerWebrtc(socket: Socket, data: any): void {
    const { to, answer } = data;
    const otherUserSocketId = this.online.get(to);
    if (otherUserSocketId)
      socket.to(otherUserSocketId).emit("webrtc-answer", { answer });
  }

  private handleEndCall(socket: Socket, data: any): void {
    const { from, to } = data;
    this.activeCalls.delete(from);
    this.activeCalls.delete(to);
    const otherUserSocketId = this.online.get(to);
    if (otherUserSocketId)
      socket.to(otherUserSocketId).emit("end-call", { from });
  }
  private handleLeave(socket: Socket, userId: string): void {
    const callPartner = this.activeCalls.get(userId);
    if (callPartner) {
      const partnerSocketId = this.online.get(callPartner);
      if (partnerSocketId)
        socket.to(partnerSocketId).emit("end-call", { from: userId });
      this.activeCalls.delete(userId);
      this.activeCalls.delete(callPartner);
    }
    socket.leave(userId);
    this.online.delete(userId);
    this.io.emit("leave", userId);
  }

  private setupSocketListeners(socket: Socket): void {
    socket.on("status", (data) => this.handleStatus(socket, data));
    socket.on("direct_message", (data) =>
      this.handleDirectMessage(socket, data)
    );
    socket.on("chat_updated", (data) => this.handleChatUpdated(socket, data));
    socket.on(
      "join",
      ({ userId, receiverId }: { userId: string; receiverId: string }) =>
        this.handleJoin(socket, userId, receiverId)
    );
    socket.on("mark_messages_read", (data) =>
      this.handleMarkMessagesRead(socket, data)
    );
    socket.on("active_user", () => this.handleActiveUser(socket));
    socket.on("leave", (userId: string) => this.handleLeave(socket, userId));
    socket.on("online", (userId: string) => this.handleOnline(socket, userId));
    socket.on("disconnect", () => this.handleDisconnect(socket));
    socket.on("call-user", (data) => this.handleCallUser(socket, data));
    socket.on("answer-call", (data) => this.handleAnswerCall(socket, data));
    socket.on("webrtc-offer", (data) => this.handleWebrtcOffer(socket, data));
    socket.on("webrtc-answer", (data) => this.handleAnswerWebrtc(socket, data));
    socket.on("ice-candidate", (data) => this.handleIceCandidate(socket, data));
    socket.on("call-rejected", (data) => this.handleCallRejected(socket, data));
    socket.on("end-call", (data) => this.handleEndCall(socket, data));
  }
  private setupListeners(): void {
    this.io.on("connection", (socket: Socket) => this.handleConnection(socket));
  }
  public getIO(): Server {
    return this.io;
  }
}
