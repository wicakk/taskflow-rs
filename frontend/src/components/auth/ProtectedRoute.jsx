import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTasksStore } from "../../hooks/useTasksStore";
import { useMasterData } from "../../hooks/useMasterData";
import { useTheme } from "../../hooks/useTheme";

function Screen({ children }) {
  const { c } = useTheme();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: c.bg, color: c.muted }}>
      <div className="max-w-[380px] text-[13.5px]">{children}</div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, booting } = useAuth();
  const store = useTasksStore();
  const master = useMasterData();
  const location = useLocation();

  if (booting) return <Screen>Memeriksa sesi login...</Screen>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in, but the data from the database hasn't arrived yet (or the API is down).
  const loadError = store.loadError || master.loadError;
  if (loadError) {
    return (
      <Screen>
        <p className="mb-4">{loadError}</p>
        <button
          onClick={() => {
            store.reload();
            master.reload();
          }}
          className="px-4 py-2 rounded-[10px] text-white text-[13px] font-medium"
          style={{ background: "#7367F0" }}
        >
          Coba lagi
        </button>
      </Screen>
    );
  }
  if (!store.ready || !master.ready) return <Screen>Memuat data dari server...</Screen>;

  return children;
}
