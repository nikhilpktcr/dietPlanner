import { Server } from "socket.io";

class SocketService {
  private static io: Server;

  public static init(io: Server) {
    SocketService.io = io;
  }

  public static sendAlert(message: string) {
    if (SocketService.io) {
      SocketService.io.emit("alert", { message });
    } else {
      console.warn("Socket.IO not initialized");
    }
  }
}

export default SocketService;
