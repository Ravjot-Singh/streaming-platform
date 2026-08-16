import { Navigate } from "react-router";
import { useAuth } from "../context/Authcontext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
 
  if (loading) {
    return <div className="p-8 text-center text-neutral-500">Loading...</div>
  }
 
  if (!user) {
    return <Navigate to="/login" replace />
  }
 
  return children
}