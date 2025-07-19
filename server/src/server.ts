import { createServer } from "http";
import app from "./app";
import { env } from "./config/envConfig";
import {
  EServerStartMessages,
  EUncaughtExceptionMessages,
  EUnhandledRejectionMessages,
} from "./messages";
import { AlertGateway } from "./modules/alert/alertGateway";
import SocketService from "./shared/socket/socketService";
import { Server } from "socket.io";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

SocketService.init(io);
new AlertGateway(io);

// Handle uncaught exceptions
process.on(EUncaughtExceptionMessages.uncaughtException, (err) => {
  console.error(
    EUncaughtExceptionMessages.uncaughtExceptionMessage,
    err.message
  );
  console.error(err.stack);
  process.exit(1);
});

const PORT = env.PORT;
const server = httpServer.listen(PORT, () => {
  console.info(`${EServerStartMessages.serverStarted}`);
  console.log(`${EServerStartMessages.serverRunning}${PORT} ✅`);
});

// Handle unhandled promise rejections (async errors)
process.on(EUnhandledRejectionMessages.unhandledRejection, (reason: any) => {
  console.error(EUnhandledRejectionMessages.unhandledRejectionMessage, reason);
  server.close(() => {
    process.exit(1);
  });
});
