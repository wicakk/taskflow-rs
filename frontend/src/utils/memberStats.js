// Active/completed task counts must reflect the *current* state of tasks
// (who's actually assigned right now, and what status those tasks are in),
// not a static number baked into the team member's seed record — otherwise
// it drifts out of sync the moment someone creates, reassigns, or completes
// a task.
export function computeMemberTaskStats(tasks, memberId, doneKey) {
  const memberTasks = tasks.filter((t) => t.assignees?.includes(memberId));
  return {
    activeTasks: memberTasks.filter((t) => t.status !== doneKey).length,
    completedTasks: memberTasks.filter((t) => t.status === doneKey).length,
  };
}

/** Resolves the "done" task status key from Master Data, with a safe fallback. */
export function resolveDoneKey(taskStatuses) {
  return taskStatuses.find((s) => s.name.toLowerCase() === "done")?.key || "done";
}
