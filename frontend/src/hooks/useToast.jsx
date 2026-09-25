import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ToastContext = createContext({ toast: () => {} });

// Minimal toast system so failed API calls (permission denied, validation
// error, server offline, ...) are visible instead of silently ignored.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    (message, type = "error") => {
      const id = `${Date.now()}${Math.random()}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[360px]" role="status" aria-live="polite">
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className="text-left text-[13px] text-white px-4 py-3 rounded-[10px] shadow-lg"
            style={{ background: t.type === "error" ? "#EA5455" : "#28C76F" }}
          >
            {t.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
