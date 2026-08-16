import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { api } from "../lib/api.js";

export default function Sidebar({ mobileOpen, onClose }) {

    const location = useLocation();
    const [channels, setChannels] = useState([]);

    useEffect(() => {

        api.listChannels(false)
            .then((data) => setChannels(data.channels))
            .catch(() => { })

    }, [])

    return (
        <>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 shrink-0
          border-r border-white/10 bg-black/60 backdrop-blur-xl p-4 overflow-y-auto
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
            >
                <nav className="space-y-1">
                    <Link
                        to="/"
                        onClick={onClose}
                        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/dashboard"
                        onClick={onClose}
                        className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                </nav>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="px-3 pb-2 text-xs uppercase tracking-wider text-neutral-500">Channels</p>
                    <nav className="space-y-1">
                        {channels.map((ch) => (
                            <Link
                                key={ch.id}
                                to={`/${ch.channel_name}`}
                                onClick={onClose}
                                className={`nav-item flex items-center gap-2 ${location.pathname === `/${ch.channel_name}` ? 'active' : ''
                                    }`}
                            >
                                <span className={`h-2 w-2 rounded-full shrink-0 ${ch.is_live ? 'bg-red-500' : 'bg-neutral-600'}`} />
                                <span className="truncate">{ch.channel_name}</span>
                            </Link>
                        ))}
                        {channels.length === 0 && (
                            <p className="px-3 text-sm text-neutral-600">No channels yet</p>
                        )}
                    </nav>
                </div>
            </aside>
        </>
    )
}