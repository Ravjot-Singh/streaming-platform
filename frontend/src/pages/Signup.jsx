import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/Authcontext";

export default function Signup() {
    const { signup } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e) {

        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {

            await signup({ username, email, password });
            navigate('/dashboard');

        } catch (err) {

            setError(err.message);
        } finally {

            setSubmitting(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-20 px-4">

            <div className="glass-panel p-6 shadow-xl">

                <h1 className="text-xl font-semibold text-white mb-5">Sign up</h1>

                {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-3">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="glass-input"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-input"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-input"
                        required
                    />

                    <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
                        {submitting ? 'Creating account...' : 'Sign up'}
                    </button>

                </form>

                <p className="text-sm text-neutral-400 mt-4">

                    Already have an account?{' '}

                    <Link to="/login" className="text-yellow-300 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}