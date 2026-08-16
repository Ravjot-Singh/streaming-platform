import * as ChannelModel from '../models/channel.model.js';
import { generateStreamKey } from '../utils/streamKey.js';

export async function createChannelForUser(userId, channelName) {

  const existing = await ChannelModel.findChannelByUserId(userId);
  if (existing) {
    const err = new Error('You already have a channel');
    err.status = 409;
    throw err;
  }

  const nameTaken = await ChannelModel.findChannelByName(channelName)
  if (nameTaken) {
    const err = new Error('Channel name already taken');
    err.status = 409;
    throw err;
  }

  const streamKey = generateStreamKey();
  return ChannelModel.createChannel({ userId, channelName, streamKey });
}



export async function getMyChannel(userId) {

  const channel = await ChannelModel.findChannelByUserId(userId);
  if (!channel) {
    const err = new Error('No channel found for this user');
    err.status = 404;
    throw err;
  }
  return channel;
}

export async function updateProfile(userId, updates) {

  const channel = await getMyChannel(userId);
  return ChannelModel.updateChannelProfile(channel.id, updates);
}

export async function regenerateKey(userId) {

  const channel = await getMyChannel(userId);
  const newKey = generateStreamKey();
  return ChannelModel.regenerateStreamKey(channel.id, newKey);
}


export async function listPublicChannels({ liveOnly } = {}) {
  return ChannelModel.listChannels({ liveOnly });
}


export async function getPublicChannel(channelName) {
  const channel = await ChannelModel.findChannelByName(channelName);

  if (!channel) {

    const err = new Error('Channel not found');

    err.status = 404;
    throw err;
  }
  const { stream_key, ...publicFields } = channel;
  return publicFields;
}