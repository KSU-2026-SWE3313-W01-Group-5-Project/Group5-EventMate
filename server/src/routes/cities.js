import express from 'express';

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const response = await fetch(
            "https://github.com/KSU-2026-SWE3313-W01-Group-5-Project/Group5-EventMate/releases/download/dataset/uscities.csv"
        );

        const citiesCSV = await response.text();

        res.send(citiesCSV);
    } catch (err) {
        res.status(500).json({ error: "Failed to load cities" })
    }
});

export default router;