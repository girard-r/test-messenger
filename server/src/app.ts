import express from "express";
import cors from "cors";
import getLogger, { LogLevel } from "./log";
import * as facebookApi from "./facebook";
import { Server } from "socket.io";
import http from "http";

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
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const clients: { [socketId: string]: string } = {};

/**
 * App Routes
 */
app.get("/facebook/login", (req, res) => {
  const { code, state } = req.query;
  logDebug(`Received code ${code} and state ${state}`);

  const re = new RegExp("{socketId=(.*)}");
  if (typeof state === "string") {
    const clientSocketId = state.match(re)[1];

    if (typeof code === "string") {
      facebookApi.getAccessToken(code).then((res) => {
        logDebug(`Access token: ${res.data.access_token}`);
        io.to(clientSocketId).emit("accessToken", {
          accessToken: res.data.access_token,
        });
      });
    } else {
      logError(`Received code ${code} should be a string`);
    }
  }
  res.send("<script>window.close();</script>");
});

/**
 * Socket io
 */
io.on("connection", (socket) => {
  logDebug(`Client ${socket.id} connected`);
  clients[socket.id] = "shouldBeAState";
  socket.on("disconnect", () => {
    logDebug(`Client ${socket.id} disconnected`);
    delete clients[socket.id];
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

/**
 * Server listens
 */
server.listen(port, () => {
  return logDebug(`Express is listening at http://localhost:${port}`);
});
