import express from "express";
import cors from "cors";
import getLogger, { LogLevel } from "./log";
import http from "http";
import { handleFacebookAuth, handleGetPages } from "./facebook";
import { createServerSocket, MessageInfo } from "./socketio";
import bodyParser from "body-parser";

/**
 * Setup express and confs
 */
const logDebug = getLogger("APP:SERVER", LogLevel.DEBUG);
const logError = getLogger("APP:SERVER");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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

// Taken from https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup
app.post("/webhook", (req, res) => {
  const body = req.body;
  console.log(req.body);

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhookEvent = entry.messaging[0];
      const message: MessageInfo = {
        msgId: webhookEvent.message.mid,
        text: webhookEvent.message.text,
        timestamp: webhookEvent.timestamp,
        senderId: webhookEvent.sender.id,
      };
      const pageId = entry["id"];
      Object.keys(socketIOServer.state).forEach((socketId) => {
        const { pagesInfo } = socketIOServer.state[socketId];

        pagesInfo.map((pageInfo) => {
          if (pageInfo.id === pageId) {
            return {
              ...pageInfo,
              lastMessageReceived: message,
            };
          }
          return pageInfo;
        });
      });

      // Broadcast the message
      socketIOServer.io.emit(`newMessage/${pageId}`, { ...message, pageId });
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "glootieisthebest";

  // Parse the query params
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
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
