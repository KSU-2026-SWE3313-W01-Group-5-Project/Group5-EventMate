import express from 'express';

import {
    getConversationWithDetails
} from '../controllers/conversationsController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/:conversation_id', authMiddleware, getConversationWithDetails);

export default router;