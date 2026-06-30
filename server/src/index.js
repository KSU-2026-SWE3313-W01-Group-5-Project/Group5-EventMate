import express from 'express';
import cors from 'cors';

import eventRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";
import citiesRoutes from "./routes/cities.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cities", citiesRoutes);

app.get("/", (req, res) => {
    res.send("Server running!");
});

async function startServer() {
    app.listen(process.env.PORT, () => {
        console.log("Server listening on port: " + process.env.PORT);
    })
}

startServer();