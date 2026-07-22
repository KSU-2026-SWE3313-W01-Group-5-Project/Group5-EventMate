import express from 'express';

import {
    getConnections,
    createConnection,
    removeConnection
} from '../controllers/connectionsController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/me', authMiddleware, getConnections);
router.post('/me/:userUUID', authMiddleware, createConnection);
router.delete('/me/:userUUID', authMiddleware, removeConnection)

export default router;