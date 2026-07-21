import express from 'express';

import {
    getConnections,
    createConnection,
} from '../controllers/connectionsController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware, getConnections);
router.post('/:userUUID', authMiddleware, createConnection);

export default router;