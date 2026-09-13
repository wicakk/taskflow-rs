import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FolderKanban, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { ROLE_LABELS, ROLE_COLORS } from "../utils/permissions";
import Badge from "../components/common/Badge";

const demoAccounts = [
  { role: "admin", email: "rizqi@taskflow.io", password: "admin123", name: "Rizqi Ananda" },
  { role: "manager", email: "nadia@taskflow.io", password: "manager123", name: "Nadia Fitriani" },
  { role: "member", email: "dewi@taskflow.io", password: "member123", name: "Dewi Lestari" },
  { role: "viewer", email: "klien@taskflow.io", password: "viewer123", name: "Klien RS Sehat" },
];

export default function Login() {
  const { c, dark } = useTheme();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  const submit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.success) {
      setError(res.error);
      return;
    }
    navigate(location.state?.from?.pathname || "/", { replace: true });
  };

  const quickLogin = (acc) => {
    const res = login(acc.email, acc.password);
    if (res.success) navigate(location.state?.from?.pathname || "/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: c.bg }}>
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-7">
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-3" style={{ background: "#7367F0" }}>
            <FolderKanban size={22} color="#fff" />
          </div>
          <div className="font-bold text-[20px] tracking-tight" style={{ color: c.textStrong }}>TASKFLOW</div>
          <p className="text-[13px] mt-1" style={{ color: c.muted }}>Sign in to manage your projects</p>
        </div>

        <div className="rounded-[16px] p-6" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.muted }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@taskflow.io"
                  required
                  className="w-full rounded-[10px] pl-9 pr-3 py-2.5 text-[13.5px] outline-none"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] mb-1.5 block" style={{ color: c.muted }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.muted }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-[10px] pl-9 pr-9 py-2.5 text-[13.5px] outline-none"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: c.muted }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-[12.5px] px-3 py-2 rounded-[9px]" style={{ background: "#EA545515", color: "#EA5455" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-[10px] text-[13.5px] font-semibold text-white transition-colors"
              style={{ background: "#7367F0" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#6257DC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#7367F0")}
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="mt-6">
          <div className="text-[11.5px] text-center mb-3" style={{ color: c.muted }}>
            Demo accounts — one for each role
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                onClick={() => quickLogin(acc)}
                className="text-left p-3 rounded-[12px] transition-colors"
                style={{ background: c.card, border: `1px solid ${c.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = c.card)}
              >
                <Badge color={ROLE_COLORS[acc.role]}>{ROLE_LABELS[acc.role]}</Badge>
                <div className="text-[12.5px] font-medium mt-2" style={{ color: c.textStrong }}>{acc.name}</div>
                <div className="text-[11px] mt-0.5 truncate" style={{ color: c.muted }}>{acc.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
