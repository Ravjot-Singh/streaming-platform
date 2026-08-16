import { Router } from "express";
import * as StreamController from '../controllers/stream.controller.js';
import { requireWebhookSecret } from "../middleware/webhookauth.middleware.js";

const router = new Router();

router.post('/validate' , requireWebhookSecret, StreamController.validate);
router.post('/end' , requireWebhookSecret , StreamController.end);
router.post('/reset-all', requireWebhookSecret, StreamController.resetAll);

export default router;