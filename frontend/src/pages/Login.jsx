import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/Authcontext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);


    async function handleSubmit(e) {

        e.preventDefault();
        setError('');;
        setSubmitting(true);

        try {

            await login({ email, password });
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

                <h1 className="text-xl font-semibold text-white mb-5">Log in</h1>

                {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-3">

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
                        {submitting ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <p className="text-sm text-neutral-400 mt-4">

                    No account?{' '}

                    <Link to="/signup" className="text-yellow-300 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}