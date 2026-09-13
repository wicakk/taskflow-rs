import { createContext, useContext, useEffect, useState } from "react";
import { useTasksStore } from "./useTasksStore";
import { can } from "../utils/permissions";

const AuthContext = createContext(null);
const STORAGE_KEY = "taskflow.auth.userId";

export function AuthProvider({ children }) {
  const { teamMembers } = useTasksStore();
  const [userId, setUserId] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : null;
  });

  // If the logged-in member gets deleted by an admin, drop the session.
  useEffect(() => {
    if (userId && !teamMembers.some((m) => m.id === userId)) {
      setUserId(null);
    }
  }, [teamMembers, userId]);

  const user = teamMembers.find((m) => m.id === userId) || null;

  const login = (email, password) => {
    const match = teamMembers.find(
      (m) => m.email.toLowerCase() === email.trim().toLowerCase() && m.password === password
    );
    if (!match) return { success: false, error: "Email atau password salah." };
    setUserId(match.id);
    window.localStorage.setItem(STORAGE_KEY, String(match.id));
    return { success: true, user: match };
  };

  const logout = () => {
    setUserId(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    can: (action) => can(user?.accessRole, action),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
