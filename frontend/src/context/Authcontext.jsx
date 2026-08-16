import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .me()
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])


 async function login(credentials) {

    const data = await api.login(credentials);
    setUser(data.user);
  }
 
  async function signup(details) {

    const data = await api.signup(details);
    setUser(data.user);
  }
 
  async function logout() {

    await api.logout();
    setUser(null);
  }

  return(
    <AuthContext.Provider value={{user , loading , login , signup , logout}}>
        {children}
    </AuthContext.Provider>
  )

}


export function useAuth(){

    return useContext(AuthContext);
}