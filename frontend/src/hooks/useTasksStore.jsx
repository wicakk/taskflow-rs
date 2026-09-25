import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

const TasksContext = createContext(null);

/* ------------------------------------------------------------------ *
 * All app data (projects, tasks, team, chat, announcements) lives in the
 * database behind the Laravel REST API. This store is only an in-memory
 * cache of what the server returned:
 *
 *   - Every create / update / delete calls the API FIRST (or optimistically
 *     with rollback for quick interactions like drag & drop and checklists).
 *   - Nothing is written to localStorage any more (only the auth token is).
 *   - Every mutator is async and resolves to the saved object (or `true` for
 *     deletes) on success, or `null` after showing an error toast on failure.
 * ------------------------------------------------------------------ */

const pick = (obj, keys) => {
  const out = {};
  keys.forEach((k) => {
    if (obj && obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
};

const emptyToNull = (v) => (v === "" || v === undefined ? null : v);

/* ---- normalizers: server shape -> the shape the UI already expects ---- */

const normalizeTask = (t) => ({
  ...t,
  id: Number(t.id),
  projectId: Number(t.projectId),
  description: t.description ?? "",
  dueDate: t.dueDate ?? "",
  comments: t.comments ?? 0,
  attachments: t.attachments ?? 0,
  assignees: (t.assignees || []).map(Number),
  labels: t.labels || [],
  checklist: (t.checklist || []).map((i) => ({ id: i.id, text: i.text, done: !!i.done })),
});

const normalizeProject = (p) => ({
  ...p,
  id: Number(p.id),
  description: p.description ?? "",
  department: p.department ?? "",
  startDate: p.startDate ?? "",
  dueDate: p.dueDate ?? "",
  progress: p.progress ?? 0,
  members: (p.members || []).map(Number),
});

const normalizeMember = (u) => ({ ...u, id: Number(u.id), role: u.role ?? "" });

const normalizeChat = (m) => ({ ...m, id: Number(m.id), projectId: Number(m.projectId), authorId: Number(m.authorId) });

const normalizeAnnouncement = (a) => ({ ...a, id: Number(a.id), authorId: Number(a.authorId), pinned: !!a.pinned });

const byName = (a, b) => a.name.localeCompare(b.name);

const TASK_FIELDS = ["title", "description", "status", "priority", "assignees", "dueDate", "labels"];
const PROJECT_FIELDS = ["name", "description", "status", "priority", "department", "startDate", "dueDate", "progress", "members"];
const MEMBER_FIELDS = ["name", "email", "password", "role", "accessRole"];

export function TasksProvider({ children }) {
  const { user, syncUser } = useAuth();
  const { toast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Latest state for rollbacks / lookups inside async callbacks.
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;
  const announcementsRef = useRef(announcements);
  announcementsRef.current = announcements;
  const loadSeq = useRef(0);

  /* ---------------- initial load / reload from the database ---------------- */
  const loadAll = useCallback(async () => {
    const seq = ++loadSeq.current;
    setLoadError(null);
    try {
      const [p, t, u, a] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks"),
        api.get("/users"),
        api.get("/announcements"),
      ]);
      if (seq !== loadSeq.current) return; // a newer load (or logout) superseded this one
      setProjects(p.map(normalizeProject));
      setTasks(t.map(normalizeTask));
      setTeamMembers(u.map(normalizeMember));
      setAnnouncements(a.map(normalizeAnnouncement));
      setReady(true);
    } catch (err) {
      if (seq !== loadSeq.current) return;
      setLoadError(err.message);
    }
  }, []);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) {
      // Logged out: forget everything that belonged to the previous user.
      loadSeq.current += 1;
      setTasks([]);
      setProjects([]);
      setTeamMembers([]);
      setChatMessages([]);
      setAnnouncements([]);
      setActiveTaskId(null);
      setReady(false);
      setLoadError(null);
      return;
    }
    setReady(false);
    loadAll();
  }, [userId, loadAll]);

  // Runs an API action; on failure shows the server's message and yields null.
  const guard = useCallback(
    async (fn) => {
      try {
        return await fn();
      } catch (err) {
        toast(err.message || "Terjadi kesalahan.");
        return null;
      }
    },
    [toast]
  );

  /* ---------------- tasks ---------------- */
  const addTask = (data) =>
    guard(async () => {
      const created = normalizeTask(
        await api.post("/tasks", {
          projectId: Number(data.projectId),
          title: data.title,
          description: data.description ?? "",
          status: data.status || "todo",
          priority: data.priority || "Medium",
          assignees: (data.assignees || []).map(Number),
          dueDate: emptyToNull(data.dueDate),
          labels: data.labels || [],
        })
      );
      setTasks((prev) => [created, ...prev]);
      return created;
    });

  const updateTask = async (taskId, patch) => {
    const body = pick(patch, TASK_FIELDS);
    if ("dueDate" in body) body.dueDate = emptyToNull(body.dueDate);
    if (Object.keys(body).length === 0) return tasksRef.current.find((t) => t.id === taskId) || null;

    const before = tasksRef.current.find((t) => t.id === taskId);
    // Optimistic: the UI (e.g. a Kanban drop) reacts instantly...
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...patch } : t)));

    try {
      const saved = normalizeTask(await api.put(`/tasks/${taskId}`, body));
      setTasks((prev) => prev.map((t) => (t.id === taskId ? saved : t)));
      return saved;
    } catch (err) {
      // ...and is rolled back (only the fields we touched) if the server refuses.
      if (before) {
        const revert = pick(before, Object.keys(body));
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...revert } : t)));
      }
      toast(err.message || "Gagal menyimpan task.");
      return null;
    }
  };

  const updateTaskStatus = (taskId, status) => updateTask(taskId, { status });

  const deleteTask = (taskId) =>
    guard(async () => {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setActiveTaskId((cur) => (cur === taskId ? null : cur));
      return true;
    });

  const setChecklist = (taskId, fn) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, checklist: fn(t.checklist) } : t)));

  const toggleChecklistItem = async (taskId, idx) => {
    const item = tasksRef.current.find((t) => t.id === taskId)?.checklist[idx];
    if (!item) return null;
    const done = !item.done;
    setChecklist(taskId, (list) => list.map((it) => (it.id === item.id ? { ...it, done } : it)));
    try {
      await api.put(`/checklist/${item.id}`, { done });
      return true;
    } catch (err) {
      setChecklist(taskId, (list) => list.map((it) => (it.id === item.id ? { ...it, done: item.done } : it)));
      toast(err.message || "Gagal memperbarui checklist.");
      return null;
    }
  };

  const addChecklistItem = (taskId, text) =>
    guard(async () => {
      const created = await api.post(`/tasks/${taskId}/checklist`, { text });
      const item = { id: created.id, text: created.text, done: !!created.done };
      setChecklist(taskId, (list) => [...list, item]);
      return item;
    });

  const removeChecklistItem = async (taskId, idx) => {
    const list = tasksRef.current.find((t) => t.id === taskId)?.checklist || [];
    const item = list[idx];
    if (!item) return null;
    setChecklist(taskId, (l) => l.filter((it) => it.id !== item.id));
    try {
      await api.delete(`/checklist/${item.id}`);
      return true;
    } catch (err) {
      setChecklist(taskId, (l) => {
        const next = [...l];
        next.splice(Math.min(idx, next.length), 0, item);
        return next;
      });
      toast(err.message || "Gagal menghapus item checklist.");
      return null;
    }
  };

  const openTask = (id) => setActiveTaskId(id);
  const closeTask = () => setActiveTaskId(null);
  const activeTask = useMemo(() => tasks.find((t) => t.id === activeTaskId) || null, [tasks, activeTaskId]);

  /* ---------------- projects ---------------- */
  const projectBody = (data) => {
    const body = pick(data, PROJECT_FIELDS);
    ["description", "department", "startDate", "dueDate"].forEach((k) => {
      if (k in body) body[k] = emptyToNull(body[k]);
    });
    if ("progress" in body) body.progress = Number(body.progress) || 0;
    if ("members" in body) body.members = (body.members || []).map(Number);
    return body;
  };

  const addProject = (data) =>
    guard(async () => {
      const created = normalizeProject(
        await api.post("/projects", { status: "Planning", priority: "Medium", ...projectBody(data) })
      );
      setProjects((prev) => [created, ...prev]);
      return created;
    });

  const updateProject = (projectId, patch) =>
    guard(async () => {
      const saved = normalizeProject(await api.put(`/projects/${projectId}`, projectBody(patch)));
      setProjects((prev) => prev.map((p) => (p.id === projectId ? saved : p)));
      return saved;
    });

  const deleteProject = (projectId) =>
    guard(async () => {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setTasks((prev) => prev.filter((t) => t.projectId !== projectId)); // cascade-deleted server-side
      setChatMessages((prev) => prev.filter((m) => m.projectId !== projectId));
      return true;
    });

  /* ---------------- team members ---------------- */
  const addMember = (data) =>
    guard(async () => {
      const body = pick(data, MEMBER_FIELDS);
      const created = normalizeMember(await api.post("/users", body));
      setTeamMembers((prev) => [...prev, created].sort(byName));
      return created;
    });

  const updateMember = (memberId, patch) =>
    guard(async () => {
      const body = pick(patch, MEMBER_FIELDS);
      if (!body.password) delete body.password; // blank = keep current password
      const saved = normalizeMember(await api.put(`/users/${memberId}`, body));
      setTeamMembers((prev) => prev.map((m) => (m.id === memberId ? saved : m)).sort(byName));
      syncUser(saved);
      return saved;
    });

  const deleteMember = (memberId) =>
    guard(async () => {
      await api.delete(`/users/${memberId}`);
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
      // The pivot rows are gone server-side; mirror that in the cache.
      setTasks((prev) => prev.map((t) => ({ ...t, assignees: t.assignees.filter((a) => a !== memberId) })));
      setProjects((prev) => prev.map((p) => ({ ...p, members: p.members.filter((m) => m !== memberId) })));
      return true;
    });

  /* ---------------- group chat (per project) ---------------- */
  // Silent on failure: this is also used for background polling.
  const loadChat = useCallback(async (projectId) => {
    try {
      const list = (await api.get(`/projects/${projectId}/chat`)).map(normalizeChat);
      setChatMessages((prev) => [...prev.filter((m) => m.projectId !== Number(projectId)), ...list]);
    } catch {
      /* ignore */
    }
  }, []);

  // `authorId` is ignored on purpose: the server takes the author from the auth token.
  const sendChatMessage = (projectId, _authorId, text) =>
    guard(async () => {
      const created = normalizeChat(await api.post(`/projects/${projectId}/chat`, { text }));
      setChatMessages((prev) => [...prev, created]);
      return created;
    });

  const deleteChatMessage = (messageId) =>
    guard(async () => {
      await api.delete(`/chat/${messageId}`);
      setChatMessages((prev) => prev.filter((m) => m.id !== messageId));
      return true;
    });

  const chatForProject = (projectId) =>
    chatMessages
      .filter((m) => m.projectId === Number(projectId))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp) || a.id - b.id);

  /* ---------------- announcements (global) ---------------- */
  const addAnnouncement = (data) =>
    guard(async () => {
      const created = normalizeAnnouncement(
        await api.post("/announcements", { title: data.title, body: data.body, pinned: !!data.pinned })
      );
      setAnnouncements((prev) => [created, ...prev]);
      return created;
    });

  const deleteAnnouncement = (id) =>
    guard(async () => {
      await api.delete(`/announcements/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      return true;
    });

  const togglePinAnnouncement = (id) =>
    guard(async () => {
      const current = announcementsRef.current.find((a) => a.id === id);
      const saved = normalizeAnnouncement(await api.put(`/announcements/${id}`, { pinned: !current?.pinned }));
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? saved : a)));
      return saved;
    });

  const sortedAnnouncements = useMemo(
    () =>
      [...announcements].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      }),
    [announcements]
  );

  const value = {
    ready,
    loadError,
    reload: loadAll,
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
    loadChat,
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
