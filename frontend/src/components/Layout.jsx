import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/Authcontext";

export default function Layout({ children }) {

    const { user } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);

    return (

        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-yellow-300/30">

            <Navbar onMenuClick={() => setMobileOpen((v) => !v)} />

            <div className="flex">

                {user && <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />}

                <main className="flex-1 min-w-0">{children}</main>

            </div>
        </div>
    )
}