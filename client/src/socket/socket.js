import { io } from "socket.io-client";

const socket = io("http://10.46.1.124:5001", {
    transports: ["websocket"]
});

export default socket;