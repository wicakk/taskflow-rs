import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api } from "../api";
import { BRAND } from "../theme";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

// Master Data (task statuses, priorities, project statuses, labels,
// departments, job titles) is stored in the database and managed through
// /api/master-data/{type}. Only admins may change it (enforced server-side).

const TYPES = ["taskStatuses", "priorities", "projectStatuses", "labels", "departments", "jobTitles"];
const ORDERED = ["taskStatuses", "priorities", "projectStatuses"]; // server orders these by `order`, the rest by name

const normalizeItem = (item) => ({
  ...item,
  id: Number(item.id),
  ...(item.description !== undefined ? { description: item.description ?? "" } : {}),
});

const byName = (a, b) => a.name.localeCompare(b.name);

const MasterDataContext = createContext(null);

export function MasterDataProvider({ children }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [lists, setLists] = useState({
    taskStatuses: [],
    priorities: [],
    projectStatuses: [],
    labels: [],
    departments: [],
    jobTitles: [],
  });
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const listsRef = useRef(lists);
  listsRef.current = lists;
  const loadSeq = useRef(0);

  const loadAll = useCallback(async () => {
    const seq = ++loadSeq.current;
    setLoadError(null);
    try {
      const results = await Promise.all(TYPES.map((t) => api.get(`/master-data/${t}`)));
      if (seq !== loadSeq.current) return;
      const next = {};
      TYPES.forEach((t, i) => {
        next[t] = results[i].map(normalizeItem);
      });
      setLists(next);
      setReady(true);
    } catch (err) {
      if (seq !== loadSeq.current) return;
      setLoadError(err.message);
    }
  }, []);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) {
      loadSeq.current += 1;
      setReady(false);
      setLoadError(null);
      return;
    }
    setReady(false);
    loadAll();
  }, [userId, loadAll]);

  const setList = (listName, fn) => setLists((prev) => ({ ...prev, [listName]: fn(prev[listName]) }));

  const guard = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      toast(err.message || "Terjadi kesalahan.");
      return null;
    }
  };

  const bodyFor = (listName, data) => {
    const body = { name: data.name };
    if (["taskStatuses", "priorities", "projectStatuses", "labels"].includes(listName)) body.color = data.color;
    if (listName === "departments") body.description = data.description || null;
    return body;
  };

  // Each returns the saved item (or `true`) on success, `null` after an error toast.
  const addItem = (listName, data) =>
    guard(async () => {
      const created = normalizeItem(await api.post(`/master-data/${listName}`, bodyFor(listName, data)));
      setList(listName, (prev) => (ORDERED.includes(listName) ? [...prev, created] : [...prev, created].sort(byName)));
      return created;
    });

  const updateItem = (listName, id, patch) =>
    guard(async () => {
      const body = {};
      const full = bodyFor(listName, { ...listsRef.current[listName].find((i) => i.id === id), ...patch });
      Object.assign(body, full);
      const saved = normalizeItem(await api.put(`/master-data/${listName}/${id}`, body));
      setList(listName, (prev) => {
        const next = prev.map((item) => (item.id === id ? saved : item));
        return ORDERED.includes(listName) ? next : next.sort(byName);
      });
      return saved;
    });

  const deleteItem = (listName, id) =>
    guard(async () => {
      await api.delete(`/master-data/${listName}/${id}`);
      setList(listName, (prev) => prev.filter((item) => item.id !== id));
      return true;
    });

  const moveItem = async (listName, id, direction) => {
    const list = listsRef.current[listName];
    const idx = list.findIndex((i) => i.id === id);
    const swapWith = idx + direction;
    if (idx < 0 || swapWith < 0 || swapWith >= list.length) return null;

    // Optimistic reorder, then persist; re-sync from the server if it fails.
    const next = [...list];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    setList(listName, () => next);
    try {
      await api.post(`/master-data/${listName}/${id}/move`, { direction });
      return true;
    } catch (err) {
      toast(err.message || "Gagal mengubah urutan.");
      loadAll();
      return null;
    }
  };

  /* ---- lookup helpers used throughout the app for colors/labels ---- */
  const { taskStatuses, priorities, projectStatuses, labels, departments, jobTitles } = lists;
  const priorityColor = (name) => priorities.find((p) => p.name === name)?.color || BRAND.muted;
  const projectStatusColor = (name) => projectStatuses.find((s) => s.name === name)?.color || BRAND.muted;
  const taskStatusColor = (key) => taskStatuses.find((s) => s.key === key)?.color || BRAND.muted;
  const taskStatusLabel = (key) => taskStatuses.find((s) => s.key === key)?.name || key;
  const labelColor = (name) => labels.find((l) => l.name === name)?.color || BRAND.muted;

  const value = {
    ready,
    loadError,
    reload: loadAll,
    taskStatuses,
    priorities,
    projectStatuses,
    labels,
    departments,
    jobTitles,
    addItem,
    updateItem,
    deleteItem,
    moveItem,
    priorityColor,
    projectStatusColor,
    taskStatusColor,
    taskStatusLabel,
    labelColor,
  };

  return <MasterDataContext.Provider value={value}>{children}</MasterDataContext.Provider>;
}

export function useMasterData() {
  const ctx = useContext(MasterDataContext);
  if (!ctx) throw new Error("useMasterData must be used within MasterDataProvider");
  return ctx;
}
