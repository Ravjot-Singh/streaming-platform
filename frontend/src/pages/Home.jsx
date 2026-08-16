import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../lib/api.js";
import { useAuth } from "../context/Authcontext";
import Landing from "./Landing";

export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!user) return;

        api
            .listChannels(true)
            .then((data) => setChannels(data.channels))
            .finally(() => setLoading(false))

    }, [user])

    useEffect(() => {
        if (!user) return;

        const source = new EventSource(`${import.meta.env.VITE_API_BASE}/channels/events`);

        source.onmessage = (event) => {
            const data = JSON.parse(event.data);

            setChannels((prev) => {
                const exists = prev.some((ch) => ch.channel_name === data.channel_name)

                if (data.is_live) {
                    if (exists) {
                        return prev.map((ch) =>
                            ch.channel_name === data.channel_name ? { ...ch, ...data } : ch
                        )
                    }
                    return [
                        ...prev,
                        { id: data.id, channel_name: data.channel_name, title: data.title, is_live: true },
                    ]
                }

                return prev.filter((ch) => ch.channel_name !== data.channel_name);
            })
        }

        source.onerror = () => {
        }

        return () => source.close();
    }, [user])

    if (authLoading) return null;

    if (!user) return <Landing />

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-xl font-semibold text-white mb-4">Live now</h1>
            {loading ? (
                <p className="text-neutral-500">Loading...</p>
            ) : channels.length === 0 ? (
                <p className="text-neutral-500">No one is live right now.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {channels.map((ch) => (
                        <Link
                            key={ch.id}
                            to={`/${ch.channel_name}`}
                            className="glass-panel overflow-hidden hover:bg-white/10"
                        >
                            <div className="relative aspect-video bg-neutral-900 flex items-center justify-center">
                                <span className="text-neutral-600 text-xs">Preview</span>
                                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-red-500 text-white">
                                    LIVE
                                </span>
                            </div>
                            <div className="p-3">
                                <h2 className="font-medium text-white truncate">{ch.channel_name}</h2>
                                {ch.title && <p className="text-sm text-neutral-400 truncate">{ch.title}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}