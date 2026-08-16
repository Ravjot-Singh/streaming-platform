import { Link } from "react-router";
import previewImage from "../assets/layout.jpg";

const features = [
    'Free to use',
    'Self-hosted - your own infrastructure',
    'Low-latency HLS playback',
    'Simple stream-key based publishing',
    'Live channel discovery',
]

export default function Landing() {

    return (

        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                    StreamPlatform
                </h1>

                <p className="text-neutral-400 mb-8 text-lg">Your own live streaming, self-hosted.</p>

                <ul className="space-y-3 mb-10">

                    {features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-neutral-200">

                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-300 shrink-0" />
                            {f}
                        </li>
                    ))}
                </ul>


                <div className="flex gap-3">
                    <Link to="/signup" className="btn-primary px-6 py-2.5">
                        Sign up
                    </Link>
                    <Link to="/login" className="btn-ghost px-6 py-2.5">
                        Log in
                    </Link>
                </div>
            </div>

            <div className="relative aspect-video rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                <img
                    src={previewImage}
                    alt="StreamPlatform preview"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-tr from-yellow-500/25 via-transparent to-transparent pointer-events-none" />
            </div>
        </div>
    )
}