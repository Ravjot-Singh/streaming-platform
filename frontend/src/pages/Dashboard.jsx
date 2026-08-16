import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function Dashboard() {

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadChannel();
  }, [])

  async function loadChannel() {

    setLoading(true);
    try {

      const data = await api.getMyChannel();
      setChannel(data.channel);

    } catch (err) {

      setChannel(null);
    } finally {

      setLoading(false);

    }
  }

  if (loading) {

    return <div className="p-8 text-center text-neutral-500">Loading...</div>
  }

  return (

    <div className="max-w-2xl mx-auto mt-6 p-4 md:p-6">

      {channel ? (
        <ChannelManager channel={channel} onUpdate={setChannel} />
      ) : (
        <CreateChannelForm onCreated={setChannel} />
      )}
    </div>
  )
}

function CreateChannelForm({ onCreated }) {

  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {

    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {

      const data = await api.createChannel({ channelName });
      onCreated(data.channel);

    } catch (err) {

      setError(err.message);

    } finally {

      setSubmitting(false);

    }
  }

  return (

    <div className="glass-panel p-6">

      <h1 className="text-xl font-semibold text-white mb-4">Create your channel</h1>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2">

        <input
          type="text"
          placeholder="channel-name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          className="glass-input flex-1"
          required
        />

        <button type="submit" disabled={submitting} className="btn-primary px-5">
          Create
        </button>
      </form>
    </div>
  )
}

function ChannelManager({ channel, onUpdate }) {

  const [title, setTitle] = useState(channel.title || '');
  const [description, setDescription] = useState(channel.description || '');
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState('');


  async function handleSaveProfile(e) {

    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {

      const data = await api.updateMyChannel({ title, description });
      onUpdate(data.channel);
      setMessage('Saved.');
    } catch (err) {

      setMessage(err.message);

    } finally {

      setSaving(false);
    }
  }

  async function handleRegenerate() {

    if (!confirm('Regenerate your stream key? Your current key will stop working immediately.')) {
      return;

    }
    setRegenerating(true);

    try {

      const data = await api.regenerateStreamKey();
      onUpdate(data.channel);

    } catch (err) {

      setMessage(err.message);

    } finally {

      setRegenerating(false);

    }
  }

  return (

    <div className="space-y-6">

      <div className="glass-panel p-6">

        <div className="flex items-center justify-between mb-4">

          <h1 className="text-xl font-semibold text-white">{channel.channel_name}</h1>

          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${channel.is_live ? 'bg-red-500 text-white' : 'bg-white/10 text-neutral-400'
              }`}
          >
            {channel.is_live ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3">

          <input
            type="text"
            placeholder="Stream title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="glass-input"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="glass-input"
            rows={3}


          />
          <button type="submit" disabled={saving} className="btn-primary px-5 py-2">
            {saving ? 'Saving...' : 'Save profile'}
          </button>

        </form>
        {message && <p className="text-sm text-neutral-400 mt-2">{message}</p>}
      </div>

      <div className="glass-panel p-6">

        <h2 className="font-semibold text-white mb-3">Stream settings</h2>

        <p className="text-sm text-neutral-400 mb-1">Publish URL (paste this whole thing into OBS/ffmpeg):</p>

        <code className="block bg-black/40 border border-white/10 p-2.5 rounded-lg text-sm mb-3 break-all text-neutral-200">

          {`${import.meta.env.VITE_RTMP_BASE}/${channel.channel_name}?key=${channel.stream_key}`}
        </code>

        <p className="text-xs text-neutral-500 mb-4">

          If your software wants Server + Stream Key as separate fields: Server is{' '}
          <code className="text-neutral-300">{import.meta.env.VITE_RTMP_BASE}</code>, Stream Key is{' '}
          <code className="text-neutral-300">{`${channel.channel_name}?key=${channel.stream_key}`}</code>.
        </p>

        <p className="text-sm text-neutral-400 mb-1">
          The <code>key</code> part is private - anyone with it can publish to your channel:
        </p>

        <code className="block bg-black/40 border border-white/10 p-2.5 rounded-lg text-sm mb-4 break-all text-neutral-200">
          {channel.stream_key}
        </code>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="text-sm px-4 py-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-500 transition disabled:opacity-50"
        >
          {regenerating ? 'Regenerating...' : 'Regenerate stream key'}
        </button>
      </div>
    </div>
  )
}