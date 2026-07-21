import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import eventRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";
import citiesRoutes from "./routes/cities.js";
import usersRoutes from "./routes/users.js";
import connectionsRoutes from "./routes/connections.js";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://centered-mapping-spring-cart.trycloudflare.com"
    ],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/connections", connectionsRoutes);

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("Server running!");
});

async function startServer() {
    app.listen(process.env.PORT, () => {
        console.log("Server listening on port: " + process.env.PORT);
    })
}

startServer();