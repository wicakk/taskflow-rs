import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import { TasksProvider } from "./hooks/useTasksStore";
import { MasterDataProvider } from "./hooks/useMasterData";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import MyTasks from "./pages/MyTasks";
import CalendarPage from "./pages/Calendar";
import Team from "./pages/Team";
import Announcements from "./pages/Announcements";
import Reports from "./pages/Reports";
import MasterData from "./pages/MasterData";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <MasterDataProvider>
        <TasksProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/my-tasks" element={<MyTasks />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/team" element={<Team />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/master-data" element={<MasterData />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </AuthProvider>
        </TasksProvider>
      </MasterDataProvider>
    </ThemeProvider>
  );
}
