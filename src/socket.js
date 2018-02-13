import React from 'react'
import SocketIOClient from "socket.io-client";

export default socket = SocketIOClient("http://localhost:3000", {
  transports: ["websocket"]
});
