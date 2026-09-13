import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CheckSquare, FolderKanban, Users, Calendar as CalendarIcon,
  BarChart3, Settings, ChevronsLeft, ChevronsRight, X, LogOut, Megaphone, Database,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useTasksStore } from "../../hooks/useTasksStore";
import { BRAND, projectColors } from "../../theme";
import { ROLE_LABELS, ROLE_COLORS } from "../../utils/permissions";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";

const baseNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/my-tasks", label: "My Tasks", icon: CheckSquare },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/team", label: "Teams", icon: Users },
  { to: "/calendar", label: "Calendar", icon: CalendarIcon },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { c, dark } = useTheme();
  const { projects } = useTasksStore();
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();
  const width = collapsed ? "w-[76px]" : "w-[248px]";

  const nav = [
    ...baseNav,
    ...(can("master:manage") ? [{ to: "/master-data", label: "Master Data", icon: Database }] : []),
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const linkStyle = (active) => ({
    background: active ? (dark ? BRAND.primarySoftDark : BRAND.primarySoftLight) : "transparent",
    color: active ? BRAND.primary : c.text,
  });

  const content = (
    <div
      className={`h-full flex flex-col shrink-0 transition-all duration-200 ${width}`}
      style={{ background: c.sidebar, borderRight: `1px solid ${c.border}` }}
    >
      <div className="flex items-center justify-between px-4 h-16 shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: BRAND.primary }}>
            <FolderKanban size={17} color="#fff" />
          </div>
          {!collapsed && (
            <span className="font-bold text-[17px] tracking-tight whitespace-nowrap" style={{ color: c.textStrong }}>
              TASKFLOW
            </span>
          )}
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden p-1 rounded-md" style={{ color: c.muted }}>
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] font-medium transition-colors duration-150 hover:brightness-95"
              style={({ isActive }) => linkStyle(isActive)}
            >
              <Icon size={18} strokeWidth={2} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}

        {!collapsed && (
          <div className="pt-5 pb-1 px-3 text-[11px] font-semibold tracking-wide" style={{ color: c.muted }}>
            My Projects
          </div>
        )}
        {projects.slice(0, 5).map((p, i) => (
          <button
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            title={p.name}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors duration-150"
            style={{ color: c.text }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: projectColors[i % projectColors.length] }} />
            {!collapsed && <span className="truncate">{p.name}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 shrink-0" style={{ borderTop: `1px solid ${c.border}` }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-full items-center gap-2 px-3 py-2 rounded-[10px] text-[13px] font-medium mb-2"
          style={{ color: c.muted }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {collapsed ? (
            <ChevronsRight size={17} />
          ) : (
            <>
              <ChevronsLeft size={17} /> <span>Collapse</span>
            </>
          )}
        </button>
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <Avatar initials={user?.initials || "?"} size={34} online={user?.online} />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold truncate" style={{ color: c.textStrong }}>
                {user?.name || "Unknown"}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge color={ROLE_COLORS[user?.accessRole]}>{ROLE_LABELS[user?.accessRole]}</Badge>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title="Log out"
            className="p-1.5 rounded-md shrink-0"
            style={{ color: c.muted }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block h-screen sticky top-0">{content}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-50">{content}</div>
        </div>
      )}
    </>
  );
}
