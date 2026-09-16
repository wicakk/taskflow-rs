import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { taskSeed, projectSeed, teamMembers as teamSeed, chatSeed, announcementSeed } from "../data/mockData";

const TasksContext = createContext(null);

const newId = (prefix) => `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;

// All app data (tasks/projects/team/chat/announcements) is persisted to
// localStorage so every screen — including Reports — always reflects the
// real, current state of each task (status changes from drag & drop,
// checklist edits, etc.) instead of resetting to seed data on navigation
// or page reload.
const STORAGE_KEY = "taskflow.data.v1";

function loadPersisted() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const persisted = loadPersisted();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(persisted?.tasks || taskSeed);
  const [projects, setProjects] = useState(persisted?.projects || projectSeed);
  const [teamMembers, setTeamMembers] = useState(persisted?.teamMembers || teamSeed);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [chatMessages, setChatMessages] = useState(persisted?.chatMessages || chatSeed);
  const [announcements, setAnnouncements] = useState(persisted?.announcements || announcementSeed);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tasks, projects, teamMembers, chatMessages, announcements })
      );
    } catch {
      // localStorage full/unavailable — data just won't persist this session.
    }
  }, [tasks, projects, teamMembers, chatMessages, announcements]);

  /* ---------------- tasks ---------------- */
  const addTask = (data) => {
    const task = {
      id: newId("t"),
      status: "todo",
      priority: "Medium",
      assignees: [],
      labels: [],
      checklist: [],
      comments: 0,
      attachments: 0,
      description: "",
      ...data,
    };
    setTasks((prev) => [...prev, task]);
    return task;
  };

  const updateTask = (taskId, patch) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));

  const updateTaskStatus = (taskId, status) => updateTask(taskId, { status });

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setActiveTaskId((cur) => (cur === taskId ? null : cur));
  };

  const toggleChecklistItem = (taskId, idx) =>
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const checklist = t.checklist.map((item, i) => (i === idx ? { ...item, done: !item.done } : item));
        return { ...t, checklist };
      })
    );

  const addChecklistItem = (taskId, text) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, checklist: [...t.checklist, { text, done: false }] } : t))
    );

  const removeChecklistItem = (taskId, idx) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, checklist: t.checklist.filter((_, i) => i !== idx) } : t))
    );

  const openTask = (id) => setActiveTaskId(id);
  const closeTask = () => setActiveTaskId(null);
  const activeTask = useMemo(() => tasks.find((t) => t.id === activeTaskId) || null, [tasks, activeTaskId]);

  /* ---------------- projects ---------------- */
  const addProject = (data) => {
    const project = {
      id: newId("p"),
      description: "",
      status: "Planning",
      priority: "Medium",
      progress: 0,
      members: [],
      ...data,
    };
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const updateProject = (projectId, patch) =>
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, ...patch } : p)));

  const deleteProject = (projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
  };

  /* ---------------- team members ---------------- */
  const addMember = (data) => {
    const initials = (data.name || "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const member = {
      id: Date.now(),
      accessRole: "member",
      online: false,
      activeTasks: 0,
      completedTasks: 0,
      workload: 0,
      initials,
      ...data,
    };
    setTeamMembers((prev) => [...prev, member]);
    return member;
  };

  const updateMember = (memberId, patch) =>
    setTeamMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, ...patch } : m)));

  const deleteMember = (memberId) => setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));

  /* ---------------- group chat (per project) ---------------- */
  const sendChatMessage = (projectId, authorId, text) => {
    const message = { id: newId("c"), projectId, authorId, text, timestamp: new Date().toISOString() };
    setChatMessages((prev) => [...prev, message]);
    return message;
  };

  const deleteChatMessage = (messageId) =>
    setChatMessages((prev) => prev.filter((m) => m.id !== messageId));

  const chatForProject = (projectId) =>
    chatMessages
      .filter((m) => m.projectId === projectId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  /* ---------------- announcements (global) ---------------- */
  const addAnnouncement = (data) => {
    const announcement = {
      id: newId("a"),
      timestamp: new Date().toISOString(),
      pinned: false,
      ...data,
    };
    setAnnouncements((prev) => [announcement, ...prev]);
    return announcement;
  };

  const deleteAnnouncement = (id) => setAnnouncements((prev) => prev.filter((a) => a.id !== id));

  const togglePinAnnouncement = (id) =>
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));

  const sortedAnnouncements = useMemo(
    () =>
      [...announcements].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      }),
    [announcements]
  );

  const value = {
    tasks,
    projects,
    teamMembers,
    activeTask,
    openTask,
    closeTask,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    addProject,
    updateProject,
    deleteProject,
    addMember,
    updateMember,
    deleteMember,
    chatMessages,
    sendChatMessage,
    deleteChatMessage,
    chatForProject,
    announcements: sortedAnnouncements,
    addAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksStore() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasksStore must be used within TasksProvider");
  return ctx;
}
