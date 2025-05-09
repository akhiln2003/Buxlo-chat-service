import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

export class SocketServer {
  private io: Server;
  private activeSockets: Map<string, string> = new Map();
  private online: Set<string> = new Set();

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: [process.env.CLIENT_URL as string, "http://localhost:5173"],
        methods: ["GET", "POST"],
      },
    });

    this.setupListeners();
  }



  private setActiveSocket(socketId: string, userId: string): void {
    console.log(`Setting active socket for user ${userId}: ${socketId}`);

    this.activeSockets.set(userId, socketId);
  }

  private removeActiveSocket(userId: string): void {
    this.activeSockets.delete(userId);
  }

  private handleConnection(socket: Socket): void {
    console.log(`User connected: ${socket.id},`, this.online);
    this.setupSocketListeners(socket);
    this.io.emit("activeUsers", Array.from(this.online));   
  }

  private handleDisconnect(socket: Socket): void {
    console.log(`User disconnected: ${socket.id}`);

    // Find and remove any user associated with this socket ID
    for (const [userId, socketId] of this.activeSockets.entries()) {
      if (socketId === socket.id) {
        this.activeSockets.delete(userId);
        console.log(`Removed user ${userId} from active sockets mapping`);
        break;
      }
    }
  }


  private handleStatus(socket: Socket, data: any): void {
    console.log("Received status:", data);

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

  private handleJoin(socket: Socket, userId: string, receiverId: string): void {
    this.setActiveSocket(socket.id, userId);
    socket.join(`${userId}${receiverId}`);
    console.log(`User ${userId} joined with socket ID: ${socket.id}`);
  }

  private handleOnline(socket: Socket, userId: string): void {
    this.online.add(userId);
    socket.emit("online", {userId});
    console.log(`User ${userId} is online with socket ID: ${socket.id}`);
  }
  private handleLeave(socket: Socket, userId: string): void {
    this.removeActiveSocket(userId);
    console.log(`User ${userId} left with socket ID: ${socket.id}`);
  }

  private setupSocketListeners(socket: Socket): void {
    socket.on("status", (data) => this.handleStatus(socket, data));

    socket.on("direct_message", (data) =>
      this.handleDirectMessage(socket, data)
    );
    socket.on(
      "join",
      ({ userId, receiverId }: { userId: string; receiverId: string }) =>
        this.handleJoin(socket, userId, receiverId)
    );

    socket.on("online", (userId: string) => this.handleOnline(socket, userId));
    socket.on("leave", (userId: string) => this.handleLeave(socket, userId));
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  private setupListeners(): void {
    this.io.on("connection", (socket: Socket) => this.handleConnection(socket));
  }

  public getIO(): Server {
    return this.io;
  }
}
