import { createContext, useContext, useEffect, useState } from "react";
import { BRAND } from "../theme";

const STORAGE_KEY = "taskflow.masterdata.v1";

const slugify = (s) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || `item${Date.now()}`;

const seed = {
  // Drives the Kanban board columns (order = workflow order). `key` is the
  // stable identifier stored on each task; it never changes after creation
  // so renaming a stage doesn't break existing tasks.
  taskStatuses: [
    { id: 1, key: "todo", name: "To Do", color: BRAND.muted },
    { id: 2, key: "inprogress", name: "In Progress", color: BRAND.primary },
    { id: 3, key: "review", name: "Review", color: BRAND.info },
    { id: 4, key: "done", name: "Done", color: BRAND.success },
  ],
  priorities: [
    { id: 1, name: "Low", color: BRAND.info },
    { id: 2, name: "Medium", color: BRAND.warning },
    { id: 3, name: "High", color: BRAND.danger },
  ],
  projectStatuses: [
    { id: 1, name: "Planning", color: BRAND.warning },
    { id: 2, name: "In Progress", color: BRAND.primary },
    { id: 3, name: "Review", color: BRAND.info },
    { id: 4, name: "Completed", color: BRAND.success },
  ],
  labels: [
    { id: 1, name: "Analysis", color: "#00CFE8" },
    { id: 2, name: "Design", color: "#9B8AFB" },
    { id: 3, name: "Frontend", color: "#7367F0" },
    { id: 4, name: "Backend", color: "#28C76F" },
    { id: 5, name: "QA", color: "#FF9F43" },
    { id: 6, name: "Docs", color: "#9CA3AF" },
    { id: 7, name: "Meeting", color: "#00CFE8" },
    { id: 8, name: "Bugfix", color: "#EA5455" },
    { id: 9, name: "DevOps", color: "#5E5873" },
    { id: 10, name: "Security", color: "#EA5455" },
    { id: 11, name: "Integration", color: "#28C76F" },
  ],
  departments: [
    { id: 1, name: "SIMRS SEHAT", description: "Sistem informasi manajemen rumah sakit utama" },
    { id: 2, name: "eLLIMS", description: "Sistem informasi laboratorium" },
    { id: 3, name: "NICU", description: "Neonatal intensive care unit" },
    { id: 4, name: "Kamar Bedah", description: "Instalasi bedah sentral" },
    { id: 5, name: "Kebidanan", description: "Unit kebidanan & kandungan" },
  ],
  jobTitles: [
    { id: 1, name: "Project Manager" },
    { id: 2, name: "Frontend Engineer" },
    { id: 3, name: "Backend Engineer" },
    { id: 4, name: "QA Engineer" },
    { id: 5, name: "UI/UX Designer" },
    { id: 6, name: "Business Analyst" },
    { id: 7, name: "Stakeholder" },
  ],
};

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

const MasterDataContext = createContext(null);

export function MasterDataProvider({ children }) {
  const [taskStatuses, setTaskStatuses] = useState(persisted?.taskStatuses || seed.taskStatuses);
  const [priorities, setPriorities] = useState(persisted?.priorities || seed.priorities);
  const [projectStatuses, setProjectStatuses] = useState(persisted?.projectStatuses || seed.projectStatuses);
  const [labels, setLabels] = useState(persisted?.labels || seed.labels);
  const [departments, setDepartments] = useState(persisted?.departments || seed.departments);
  const [jobTitles, setJobTitles] = useState(persisted?.jobTitles || seed.jobTitles);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ taskStatuses, priorities, projectStatuses, labels, departments, jobTitles })
      );
    } catch {
      // ignore — data just won't persist this session
    }
  }, [taskStatuses, priorities, projectStatuses, labels, departments, jobTitles]);

  const listMap = {
    taskStatuses: [taskStatuses, setTaskStatuses],
    priorities: [priorities, setPriorities],
    projectStatuses: [projectStatuses, setProjectStatuses],
    labels: [labels, setLabels],
    departments: [departments, setDepartments],
    jobTitles: [jobTitles, setJobTitles],
  };

  const addItem = (listName, data) => {
    const [, setList] = listMap[listName];
    const item = { id: Date.now(), ...data };
    if (listName === "taskStatuses") item.key = slugify(data.name);
    setList((prev) => [...prev, item]);
    return item;
  };

  const updateItem = (listName, id, patch) => {
    const [, setList] = listMap[listName];
    // `key` is immutable once a task status exists, to avoid orphaning tasks.
    const safePatch = listName === "taskStatuses" ? { ...patch, key: undefined } : patch;
    setList((prev) => prev.map((item) => (item.id === id ? { ...item, ...safePatch, key: item.key ?? safePatch.key } : item)));
  };

  const deleteItem = (listName, id) => {
    const [, setList] = listMap[listName];
    setList((prev) => prev.filter((item) => item.id !== id));
  };

  const moveItem = (listName, id, direction) => {
    const [list, setList] = listMap[listName];
    const idx = list.findIndex((i) => i.id === id);
    const swapWith = idx + direction;
    if (idx < 0 || swapWith < 0 || swapWith >= list.length) return;
    const next = [...list];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    setList(next);
  };

  /* ---- lookup helpers used throughout the app for colors/labels ---- */
  const priorityColor = (name) => priorities.find((p) => p.name === name)?.color || BRAND.muted;
  const projectStatusColor = (name) => projectStatuses.find((s) => s.name === name)?.color || BRAND.muted;
  const taskStatusColor = (key) => taskStatuses.find((s) => s.key === key)?.color || BRAND.muted;
  const taskStatusLabel = (key) => taskStatuses.find((s) => s.key === key)?.name || key;
  const labelColor = (name) => labels.find((l) => l.name === name)?.color || BRAND.muted;

  const value = {
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
