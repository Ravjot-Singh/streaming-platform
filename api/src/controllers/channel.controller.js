import * as ChannelService from '../services/channel.service.js';
import * as SseService from '../services/sse.service.js';

export async function createChannel(req, res, next) {
  try {
    const { channelName } = req.body
    if (!channelName) {
      return res.status(400).json({ error: 'channelName is required' })
    }
    const channel = await ChannelService.createChannelForUser(req.user.id, channelName)
    res.status(201).json({ channel })
  } catch (err) {
    next(err)
  }
}

export async function getMyChannel(req, res, next) {
  try {
    const channel = await ChannelService.getMyChannel(req.user.id)
    res.json({ channel })
  } catch (err) {
    next(err)
  }
}

export async function updateMyChannel(req, res, next) {
  try {
    const { title, description, avatarUrl } = req.body
    const channel = await ChannelService.updateProfile(req.user.id, {
      title,
      description,
      avatarUrl,
    })
    res.json({ channel })
  } catch (err) {
    next(err)
  }
}

export async function regenerateStreamKey(req, res, next) {
  try {
    const channel = await ChannelService.regenerateKey(req.user.id)
    res.json({ channel })
  } catch (err) {
    next(err)
  }
}


export async function listChannels(req, res, next) {
  try {
    const liveOnly = req.query.live === 'true';
    const channels = await ChannelService.listPublicChannels({ liveOnly });
    res.json({ channels });
  } catch (err) {
    next(err);
  }
}

export async function getPublicChannel(req, res, next) {
  try {
    const channel = await ChannelService.getPublicChannel(req.params.channelName);
    res.json({ channel });
  } catch (err) {
    next(err);
  }
}

export async function masterPlaylist(req, res, next) {

  try {

    const { channelName } = req.params;

    await ChannelService.getPublicChannel(channelName);

    const hlsBase = process.env.HLS_PUBLIC_BASE;

    const playlist = [
      '#EXTM3U',
      '#EXT-X-STREAM-INF:BANDWIDTH=4000000',
      `${hlsBase}/source/${channelName}/index.m3u8`,
      '#EXT-X-STREAM-INF:BANDWIDTH=2628000,RESOLUTION=1280x720',
      `${hlsBase}/transcode_720/${channelName}/index.m3u8`,
      '#EXT-X-STREAM-INF:BANDWIDTH=900000,RESOLUTION=640x360',
      `${hlsBase}/transcode_360/${channelName}/index.m3u8`,
    ].join('\n');

    res.set('Content-Type', 'application/vnd.apple.mpegurl');

    res.send(playlist);

  } catch (err) {
    next(err)
  }
}


export async function allChannelsEvents(req, res) {

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders?.();
 
  SseService.subscribeGlobal(res);
 
  req.on('close', () => {
    SseService.unsubscribeGlobal(res);
  })
}


export async function channelEvents(req, res) {

  const { channelName } = req.params;

  res.writeHead(200, {

    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',

  })

  res.flushHeaders?.();

  try {

    const channel = await ChannelService.getPublicChannel(channelName);

    res.write(`data: ${JSON.stringify({ is_live: channel.is_live })}\n\n`);

  } catch {

  }

  SseService.subscribe(channelName, res);

  req.on('close', () => {
    SseService.unsubscribe(channelName, res);
  })

}