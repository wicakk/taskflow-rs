// Central design tokens. Mirrors tailwind.config.js so JS-side inline
// styles (dynamic colors, charts, avatars) stay in sync with Tailwind classes.

export const palette = {
  light: {
    bg: "#F7F7FB",
    card: "#FFFFFF",
    sidebar: "#FFFFFF",
    text: "#5E5873",
    textStrong: "#2B2942",
    muted: "#9CA3AF",
    border: "#E9E7F0",
    hover: "#F4F3FA",
    kanbanColBg: "#F0EFF7",
  },
  dark: {
    bg: "#111827",
    card: "#1C2330",
    sidebar: "#151A24",
    text: "#E5E7EB",
    textStrong: "#F9FAFB",
    muted: "#8B93A7",
    border: "#2D3544",
    hover: "#232B3A",
    kanbanColBg: "#171E2B",
  },
};

export const BRAND = {
  primary: "#7367F0",
  primaryHover: "#6257DC",
  primarySoftLight: "#EDEBFD",
  primarySoftDark: "#2A2650",
  success: "#28C76F",
  warning: "#FF9F43",
  danger: "#EA5455",
  info: "#00CFE8",
  muted: "#9CA3AF",
};

export const projectColors = ["#7367F0", "#28C76F", "#FF9F43", "#00CFE8", "#EA5455", "#9B8AFB"];

export const priorityColor = (p) =>
  p === "High" ? BRAND.danger : p === "Medium" ? BRAND.warning : BRAND.info;

export const statusColor = (s) => {
  switch (s) {
    case "Completed":
      return BRAND.success;
    case "In Progress":
      return BRAND.primary;
    case "Review":
      return BRAND.info;
    case "Planning":
      return BRAND.warning;
    default:
      return BRAND.muted;
  }
};

export const taskStatusColor = (s) =>
  ({ todo: BRAND.muted, inprogress: BRAND.primary, review: BRAND.info, done: BRAND.success }[s]);

export const taskStatusLabel = (s) =>
  ({ todo: "To Do", inprogress: "In Progress", review: "Review", done: "Done" }[s]);

export const columns = [
  { key: "todo", label: "To Do" },
  { key: "inprogress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];
