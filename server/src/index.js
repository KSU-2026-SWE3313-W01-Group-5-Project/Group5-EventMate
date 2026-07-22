import express from 'express';
import cookieParser from 'cookie-parser';
import http from "http";
import {Server} from "socket.io";
import cors from "cors";

import eventRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";
import citiesRoutes from "./routes/cities.js";
import usersRoutes from "./routes/users.js";
import connectionsRoutes from "./routes/connections.js";
import conversationsRoutes from "./routes/conversations.js";

import {setupSocketHandlers} from "./utils/socketHandlers.js";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/connections", connectionsRoutes);
app.use("/api/conversations", conversationsRoutes);

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("Server running!");
});

setupSocketHandlers(io);

async function startServer() {
    server.listen(process.env.PORT, () => {
        console.log("Server listening on port: " + process.env.PORT);
    })
}

startServer();