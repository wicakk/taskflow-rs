import React, { useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TaskDetail from "../components/tasks/TaskDetail";
import { useTheme } from "../hooks/useTheme";
import { useTasksStore } from "../hooks/useTasksStore";

const titleMap = {
  "/": "Dashboard",
  "/my-tasks": "My Tasks",
  "/projects": "Projects",
  "/calendar": "Calendar",
  "/team": "Teams",
  "/announcements": "Announcements",
  "/reports": "Reports",
  "/master-data": "Master Data",
  "/settings": "Settings",
};

export default function MainLayout() {
  const { c } = useTheme();
  const { activeTask, closeTask, projects } = useTasksStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const params = useParams();

  let pageTitle = titleMap[location.pathname] || "TaskFlow";
  let breadcrumb = [pageTitle];

  if (location.pathname.startsWith("/projects/") && params.id) {
    const project = projects.find((p) => p.id === params.id);
    pageTitle = project?.name || "Project";
    breadcrumb = ["Projects", pageTitle];
  }

  return (
    <div style={{ background: c.bg, color: c.text, minHeight: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="flex-1 min-w-0 flex flex-col">
          <Header pageTitle={pageTitle} breadcrumb={breadcrumb} setMobileOpen={setMobileOpen} />
          <main className="flex-1 p-4 md:p-7 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>

      {activeTask && (
        <TaskDetail
          task={activeTask}
          project={projects.find((p) => p.id === activeTask.projectId)}
          onClose={closeTask}
        />
      )}
    </div>
  );
}
