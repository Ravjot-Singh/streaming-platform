import { Link } from 'react-router';
import { useAuth } from '../context/Authcontext';

export default function Navbar({ onMenuClick }) {

    const { user, logout } = useAuth()

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">

            <div className="flex items-center justify-between px-4 md:px-6 h-16">

                <div className="flex items-center gap-3">

                    {user && (

                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 text-neutral-300 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

                                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />

                            </svg>

                        </button>
                    )}

                    <Link to="/" className="text-lg font-bold tracking-tight text-white">
                        StreamPlatform
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-3">

                    {user ? (
                        <>
                            <span className="hidden sm:block text-sm text-neutral-300 mr-1">{user.username}</span>

                            <button onClick={logout} className="btn-ghost text-sm px-4 py-1.5">
                                Logout
                            </button>

                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm px-3 py-1.5 rounded-full text-neutral-200 hover:bg-white/10 transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="btn-primary text-sm px-4 py-1.5">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}