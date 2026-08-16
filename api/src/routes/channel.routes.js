import { Router } from "express";
import * as ChannelController from '../controllers/channel.controller.js';
import { requireAuth } from "../middleware/auth.middleware.js";

const router = new Router();

router.post('/', requireAuth, ChannelController.createChannel);
router.get('/', ChannelController.listChannels);
router.get('/events', ChannelController.allChannelsEvents);
router.get('/me', requireAuth, ChannelController.getMyChannel);
router.patch('/update', requireAuth, ChannelController.updateMyChannel);
router.post('/me/regenerate-key', requireAuth, ChannelController.regenerateStreamKey);
 
router.get('/:channelName/events', ChannelController.channelEvents);
router.get('/:channelName/master.m3u8', ChannelController.masterPlaylist);
router.get('/:channelName', ChannelController.getPublicChannel);
 
export default router;