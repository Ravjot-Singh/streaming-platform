import * as ChannelModel from '../models/channel.model.js';
import * as StreamSessionModel from '../models/streamSession.model.js';
import * as SseService from './sse.service.js';

export async function validatePublish(channelName, providedKey) {
    const channel = await ChannelModel.findChannelByName(channelName);

    if (!channel || !providedKey || channel.stream_key !== providedKey) {

        const err = new Error('Invalid channel or stream key');
        err.status = 403;
        throw err;
    }

    await ChannelModel.setLiveStatus(channel.id, true);
    await StreamSessionModel.startSession(channel.id);
    SseService.broadcast(channelName, {
        is_live: true,
        id: channel.id,
        channel_name: channel.channel_name,
        title: channel.title,
    });

    return channel;
}


export async function endPublish(channelName) {
    const channel = await ChannelModel.findChannelByName(channelName);
    if (!channel) {
        return null;
    }

    await ChannelModel.setLiveStatus(channel.id, false);
    await StreamSessionModel.endLatestSession(channel.id);
  SseService.broadcast(channelName, {
    is_live: false,
    id: channel.id,
    channel_name: channel.channel_name,
    title: channel.title,
  });
    return channel;
}


export async function resetAllLiveStatus() {
    const clearedChannels = await ChannelModel.clearAllLiveStatus();
    const closedSessions = await StreamSessionModel.endAllOpenSessions();
    return { clearedChannels: clearedChannels.length, closedSessions: closedSessions.length };
}