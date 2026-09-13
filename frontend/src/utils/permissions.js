// Central place for "who can do what". Keep the matrix flat and boolean so
// UI code can just call `can(accessRole, "task:delete")` without knowing
// anything about the underlying roles.

import { BRAND } from "../theme";

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
  VIEWER: "viewer",
};

export const ROLE_LABELS = {
  admin: "Admin",
  manager: "Project Manager",
  member: "Member",
  viewer: "Viewer",
};

export const ROLE_COLORS = {
  admin: BRAND.danger,
  manager: BRAND.primary,
  member: BRAND.info,
  viewer: BRAND.muted,
};

export const ROLE_DESCRIPTIONS = {
  admin: "Full access: projects, tasks, and team management.",
  manager: "Can manage all projects and tasks, but not team roles.",
  member: "Can create and update tasks, cannot delete or manage projects.",
  viewer: "Read-only access. Cannot create, edit, or delete anything.",
};

const MATRIX = {
  admin: {
    "project:create": true,
    "project:edit": true,
    "project:delete": true,
    "task:create": true,
    "task:edit": true,
    "task:delete": true,
    "task:move": true,
    "team:manage": true,
    "announcement:pin": true,
    "master:manage": true,
  },
  manager: {
    "project:create": true,
    "project:edit": true,
    "project:delete": true,
    "task:create": true,
    "task:edit": true,
    "task:delete": true,
    "task:move": true,
    "team:manage": false,
    "announcement:pin": true,
    "master:manage": false,
  },
  member: {
    "project:create": false,
    "project:edit": false,
    "project:delete": false,
    "task:create": true,
    "task:edit": true,
    "task:delete": false,
    "task:move": true,
    "team:manage": false,
    "announcement:pin": false,
    "master:manage": false,
  },
  viewer: {
    "project:create": false,
    "project:edit": false,
    "project:delete": false,
    "task:create": false,
    "task:edit": false,
    "task:delete": false,
    "task:move": false,
    "team:manage": false,
    "announcement:pin": false,
    "master:manage": false,
  },
};

export function can(accessRole, action) {
  return !!MATRIX[accessRole]?.[action];
}
