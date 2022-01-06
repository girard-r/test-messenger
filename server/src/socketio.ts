import { Server } from "socket.io";
import getLogger, { LogLevel } from "./log";
import http from "http";

const logDebug = getLogger("APP:SOCKETIO", LogLevel.DEBUG);
const logError = getLogger("APP:SOCKETIO");

export interface SocketIOState {
  [socketId: string]: {
    accessTokenInfo?: {
      accessToken: string;
      tokenType: string;
      appId: string;
      type: string;
      application: string;
      dataAccessExpiresAt: number;
      expiresAt: number;
      isValid: boolean;
      issuedAt: number;
      scopes: string[];
      granularScopes: { scope: string }[];
      userId: string;
    };
  };
}

export interface SocketIOServerSocket {
  io: Server;
  state: SocketIOState;
}

/**
 * Socket io
 */
export const createServerSocket = (
  server: http.Server
): SocketIOServerSocket => {
  const clients: SocketIOState = {};
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logDebug(`Client ${socket.id} connected`);
    clients[socket.id] = {};
    socket.on("disconnect", () => {
      logDebug(`Client ${socket.id} disconnected`);
      delete clients[socket.id];
    });
  });

  io.engine.on("connection_error", (err) => {
    logError(err.req); // the request object
    logError(err.code); // the error code, for example 1
    logError(err.message); // the error message, for example "Session ID unknown"
    logError(err.context); // some additional error context
  });

  return { io, state: clients };
};
