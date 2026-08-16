import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { api } from "../lib/api.js";
import Player from "../components/Player";


const OFFLINE_GRACE_MS = 35000;

export default function ChannelPage() {
  const { channelName } = useParams();
  const [channel, setChannel] = useState(null);
  const [displayLive, setDisplayLive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionKey, setSessionKey] = useState(0);
  const wasLiveRef = useRef(false);
  const offlineTimerRef = useRef(null);

  useEffect(() => {
    async function loadInitial() {

      try {

        const data = await api.getPublicChannel(channelName);
        wasLiveRef.current = data.channel.is_live;
        setDisplayLive(data.channel.is_live);
        setChannel(data.channel);
        setError('');

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }
    }
    loadInitial();

  }, [channelName])

  useEffect(() => {
    const source = new EventSource(`${import.meta.env.VITE_API_BASE}/channels/${channelName}/events`)

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.is_live) {

        if (offlineTimerRef.current) {
          clearTimeout(offlineTimerRef.current);
          offlineTimerRef.current = null;
        }

        if (!wasLiveRef.current) {

          setSessionKey((k) => k + 1);

        }

        wasLiveRef.current = true;
        setDisplayLive(true);

      } else {

        wasLiveRef.current = false;

        offlineTimerRef.current = setTimeout(() => {

          setDisplayLive(false);
          offlineTimerRef.current = null;

        }, OFFLINE_GRACE_MS)
      }
    }

    source.onerror = () => {
    }

    return () => {
      source.close();

      if (offlineTimerRef.current) {
        clearTimeout(offlineTimerRef.current)
      }
    }
  }, [channelName])

  if (loading) {
    return <div className="p-8 text-center text-neutral-500">Loading...</div>
  }

  if (error || !channel) {
    return <div className="p-8 text-center text-red-400">{error || 'Channel not found'}</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {displayLive ? (
        <Player
          key={sessionKey}
          hlsUrl={`${import.meta.env.VITE_API_BASE}/channels/${channel.channel_name}/master.m3u8`}
        />
      ) : (
        <div className="aspect-video rounded-2xl border border-white/10 bg-neutral-900 flex items-center justify-center">
          <p className="text-neutral-500">Channel is offline</p>
        </div>
      )}

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-white truncate">{channel.channel_name}</h1>
          {channel.title && <p className="text-neutral-300 mt-1">{channel.title}</p>}
        </div>
        <span
          className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${displayLive ? 'bg-red-500 text-white' : 'bg-white/10 text-neutral-400'
            }`}
        >
          {displayLive ? 'LIVE' : 'OFFLINE'}
        </span>
      </div>

      {channel.description && (
        <div className="glass-panel mt-4 p-4">
          <p className="text-neutral-300 whitespace-pre-wrap">{channel.description}</p>
        </div>
      )}
    </div>
  )
}