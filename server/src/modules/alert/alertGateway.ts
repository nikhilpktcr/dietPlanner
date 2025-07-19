import { Server, Socket } from "socket.io";

export class AlertGateway {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupListeners();
  }

  private setupListeners() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
    });
  }
}
