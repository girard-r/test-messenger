import express from "express";
import cors from "cors";
import getLogger, { LogLevel } from "./log";
import http from "http";
import { handleFacebookAuth, handleGetPages } from "./facebook";
import { createServerSocket } from "./socketio";

/**
 * Setup express and confs
 */
const logDebug = getLogger("APP:SERVER", LogLevel.DEBUG);
const logError = getLogger("APP:SERVER");
const app = express();
const server = http.createServer(app);
app.use(cors());
app.options("*", cors());
const port = process.env.PORT || 3001;

/**
 * Init Socket IO Server
 */
const socketIOServer = createServerSocket(server);

/**
 * App Routes
 */
app.get("/api/facebook/login", (req, res) => {
  const { code, state } = req.query;
  logDebug(`Received code ${code} and state ${state}`);
  handleFacebookAuth(code as string, state as string, socketIOServer);
  res.send("<script>window.close();</script>");
});

app.get("/api/facebook/:socketId/pages", (req, res) => {
  const { socketId } = req.params;
  handleGetPages(socketId, socketIOServer);
  return res.status(200);
});

/**
 * Server
 */
server.on("error", (err) => {
  logError(err);
});

server.listen(port, () => {
  return logDebug(`Express is listening at http://localhost:${port}`);
});
