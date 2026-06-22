import express from 'express';
import cors from 'cors';

import {runSchema} from "./db/index.js";
import runSeed from "./db/seed.js";

import eventRoutes from "./routes/events.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Server running!");
});

async function startServer() {
    await runSchema();

    if (process.env.SEED_DB === 'true') {
        await runSeed();
    }

    app.listen(process.env.PORT, () => {
        console.log("Server listening on port: " + process.env.PORT);
    })
}

startServer();