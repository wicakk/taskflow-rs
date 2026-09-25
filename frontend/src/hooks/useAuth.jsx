import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, clearToken, getToken, setToken, setUnauthorizedHandler } from "../api";
import { can } from "../utils/permissions";

const AuthContext = createContext(null);

const normalizeUser = (u) => (u ? { ...u, role: u.role ?? "" } : null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token is already stored, we must ask the server who it belongs to
  // before deciding whether to show the app or the login page.
  const [booting, setBooting] = useState(() => !!getToken());

  const dropSession = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(dropSession);
    return () => setUnauthorizedHandler(null);
  }, [dropSession]);

  useEffect(() => {
    if (!getToken()) return undefined;
    let cancelled = false;
    api
      .get("/me")
      .then((me) => !cancelled && setUser(normalizeUser(me)))
      .catch((err) => {
        // Only a real "not logged in" answer ends the session. If the server
        // is just unreachable, keep the token so a reload can recover.
        if (!cancelled && err.status === 401) dropSession();
      })
      .finally(() => !cancelled && setBooting(false));
    return () => {
      cancelled = true;
    };
  }, [dropSession]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email: email.trim(), password });
      setToken(res.token);
      const u = normalizeUser(res.user);
      setUser(u);
      return { success: true, user: u };
    } catch (err) {
      return { success: false, error: err.message || "Email atau password salah." };
    }
  };

  const logout = () => {
    // Fire-and-forget: revoke the token server-side, but never make the user
    // wait (or get stuck) if the request fails.
    if (getToken()) api.post("/logout").catch(() => {});
    dropSession();
  };

  // Keep the logged-in user's profile in sync after they edit themselves in Team.
  const syncUser = (patch) => setUser((cur) => (cur && patch?.id === cur.id ? { ...cur, ...normalizeUser(patch) } : cur));

  const value = {
    user,
    booting,
    isAuthenticated: !!user,
    login,
    logout,
    syncUser,
    can: (action) => can(user?.accessRole, action),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
