import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Sun, Moon, ChevronDown, ChevronRight, Home, Menu, Command,
  CheckSquare, Flag, MessageSquare, Clock, LogOut, User as UserIcon,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { BRAND } from "../../theme";
import { ROLE_LABELS, ROLE_COLORS } from "../../utils/permissions";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import Dropdown from "../common/Dropdown";

const notifications = [
  { icon: CheckSquare, text: 'Dewi menyelesaikan "Sinkronisasi data eLLIMS"', time: "5m", color: BRAND.success },
  { icon: Flag, text: 'Task "Implementasi API pasien" ditandai High priority', time: "1h", color: BRAND.danger },
  { icon: MessageSquare, text: 'Aditya menyebut Anda di "Review keamanan API"', time: "2h", color: BRAND.info },
  { icon: Clock, text: 'Deadline "Testing modul rawat inap" besok', time: "3h", color: BRAND.warning },
];

export default function Header({ pageTitle, breadcrumb, setMobileOpen }) {
  const { c, dark, toggleDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header
      className="h-16 shrink-0 flex items-center justify-between gap-3 px-4 md:px-7 sticky top-0 z-30"
      style={{ background: c.card, borderBottom: `1px solid ${c.border}` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button className="md:hidden p-1.5 rounded-md" style={{ color: c.text }} onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 text-[13px] min-w-0" style={{ color: c.muted }}>
          <Home size={13} />
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight size={12} />
              <span
                className="truncate"
                style={{ color: i === breadcrumb.length - 1 ? c.textStrong : c.muted, fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}
              >
                {b}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-md hidden lg:block">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.muted }} />
          <input
            placeholder="Search projects, tasks, people..."
            className="w-full rounded-[10px] pl-9 pr-14 py-2 text-[13px] outline-none"
            style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
          />
          <span
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-md"
            style={{ color: c.muted, border: `1px solid ${c.border}` }}
          >
            <Command size={11} />K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <button
          onClick={toggleDark}
          className="p-2 rounded-[10px] transition-colors"
          style={{ color: c.text }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-[10px]"
            style={{ color: c.text }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: BRAND.danger }} />
          </button>
          <Dropdown open={notifOpen} onClose={() => setNotifOpen(false)} width={320}>
            <div className="px-4 py-3 text-[13px] font-semibold" style={{ borderBottom: `1px solid ${c.border}`, color: c.textStrong }}>
              Notifications
            </div>
            {notifications.map((n, i) => {
              const Icon = n.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{ borderBottom: i < notifications.length - 1 ? `1px solid ${c.border}` : "none" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: n.color + "20" }}>
                    <Icon size={14} color={n.color} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12.5px] leading-snug" style={{ color: c.text }}>
                      {n.text}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: c.muted }}>
                      {n.time} ago
                    </div>
                  </div>
                </div>
              );
            })}
          </Dropdown>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-[10px]"
          >
            <Avatar initials={user?.initials || "?"} size={32} online={user?.online} />
            <ChevronDown size={14} className="hidden sm:block" style={{ color: c.muted }} />
          </button>
          <Dropdown open={profileOpen} onClose={() => setProfileOpen(false)} width={232}>
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-2.5">
                <Avatar initials={user?.initials || "?"} size={36} />
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate" style={{ color: c.textStrong }}>{user?.name}</div>
                  <div className="text-[11px] truncate" style={{ color: c.muted }}>{user?.email}</div>
                </div>
              </div>
              <div className="mt-2">
                <Badge color={ROLE_COLORS[user?.accessRole]}>{ROLE_LABELS[user?.accessRole]}</Badge>
              </div>
            </div>
            <div className="py-1.5">
              {["Profile", "Account Settings", "Help & Support"].map((it) => (
                <button
                  key={it}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-[13px]"
                  style={{ color: c.text }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <UserIcon size={14} style={{ color: c.muted }} />
                  {it}
                </button>
              ))}
              <div style={{ borderTop: `1px solid ${c.border}` }} className="mt-1 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-[13px]"
                  style={{ color: BRAND.danger }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <LogOut size={14} />
                  Log Out
                </button>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
