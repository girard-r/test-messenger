import React from "react";
import { io, Socket } from "socket.io-client";

export const socket = io("http://localhost:3001");
socket.on("connected", () => {
  console.log("socket connected");
});

socket.on("connect_error", (e) => {
  console.log("socket error", e);
});

export const SocketContext = React.createContext<Socket>(socket);
