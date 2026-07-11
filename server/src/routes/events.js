import express from 'express';

// API routes for /api/events.
//
// Routes:
// GET /api/events/ -> returns all events via getEvents controller (see eventController.js)
//
// Keeps routing logic separate from controllers, that way we can keep everything cleaner and disconnected to stop conflicts early

import {
    getEvents,
} from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getEvents);


export default router;