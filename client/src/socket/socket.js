import { io } from "socket.io-client";

const socket = io("http://192.168.100.205:5001", {
    transports: ["websocket"]
});

export default socket;