require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.get("/", (req, res) => {
    res.send("Realtime Collaboration Server");
});

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://192.168.100.205:5173"
        ],
        methods: ["GET", "POST"],
    },
});

/*
documentUsers = {
    documentId: {
        socketId: username
    }
}
*/

const documentUsers = {};

io.on("connection", (socket) => {

    console.log("✅ Connected :", socket.id);

    // ==========================
    // JOIN DOCUMENT
    // ==========================

    socket.on("join-document", ({ documentId, user }) => {

        socket.join(documentId);

        socket.documentId = documentId;
        socket.userName = user;

        if (!documentUsers[documentId]) {
            documentUsers[documentId] = {};
        }

        documentUsers[documentId][socket.id] = user;

        io.to(documentId).emit(
            "online-users",
            Object.values(documentUsers[documentId])
        );

        console.log(`${user} joined ${documentId}`);

    });

    // ==========================
    // SEND CHANGES
    // ==========================

    socket.on("send-changes", ({ documentId, content }) => {

    console.log("SEND CHANGES dari", socket.userName);

    socket.to(documentId).emit(
        "receive-changes",
        content
    );

});

    // ==========================
    // TYPING
    // ==========================

   socket.on("typing", ({ documentId, user }) => {

    console.log(
        "Typing dari",
        user,
        "socket:",
        socket.id
    );

    socket.to(documentId).emit("typing", {
        user,
        sender: socket.id
    });

});

    // ==========================
    // CURSOR MOVE
    // ==========================

    socket.on("cursor-move", ({ documentId, x, y, name, color }) => {

    socket.to(documentId).emit("cursor-move", {
        id: socket.id,
        x,
        y,
        name,
        color
    });

});

    // ==========================
    // DISCONNECT
    // ==========================

    socket.on("disconnect", () => {

        console.log("❌ Disconnected :", socket.id);

        const room = socket.documentId;

        if (
            room &&
            documentUsers[room] &&
            documentUsers[room][socket.id]
        ) {

            delete documentUsers[room][socket.id];

            io.to(room).emit(
                "online-users",
                Object.values(documentUsers[room])
            );

            if (
                Object.keys(documentUsers[room]).length === 0
            ) {

                delete documentUsers[room];

            }

        }

    });

});

server.listen(5001, () => {

    console.log("🚀 Socket Server berjalan di http://localhost:5001");

});