import { createContext, useState, useEffect, useCallback } from "react";
import { API_URL } from "../lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTokens = () => ({
    access_token: localStorage.getItem("cnb_access_token"),
    refresh_token: localStorage.getItem("cnb_refresh_token"),
  });

  const saveTokens = (access_token, refresh_token) => {
    localStorage.setItem("cnb_access_token", access_token);
    localStorage.setItem("cnb_refresh_token", refresh_token);
  };

  const clearTokens = () => {
    localStorage.removeItem("cnb_access_token");
    localStorage.removeItem("cnb_refresh_token");
  };

  const fetchUser = useCallback(async () => {
    const { access_token, refresh_token } = getTokens();
    if (!access_token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      let res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      // If token expired, try refreshing
      if (res.status === 401 && refresh_token) {
        const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          saveTokens(data.access_token, data.refresh_token);
          setUser(data.user);
          setLoading(false);
          return;
        } else {
          clearTokens();
          setUser(null);
          setLoading(false);
          return;
        }
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        clearTokens();
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signUp = async (email, password, name) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    saveTokens(data.access_token, data.refresh_token);
    setUser(data.user);
    return data.user;
  };

  const signIn = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    saveTokens(data.access_token, data.refresh_token);
    setUser(data.user);
    return data.user;
  };

  const signOut = () => {
    clearTokens();
    setUser(null);
  };

  const getAccessToken = () => localStorage.getItem("cnb_access_token");

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
