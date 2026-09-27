// Active/completed task counts — and their share of the member's total
// workload — must reflect the *current* state of tasks (who's actually
// assigned right now, and what status those tasks are in), not a static
// number baked into the team member's row in the database — otherwise it
// drifts out of sync the moment someone creates, reassigns, or completes a
// task.
//
// Formula (as specified): for each category, (jumlah task kategori itu /
// total pekerjaan) x 100 — so "Complete %" and "Sedang berjalan %" are each
// out of the member's total assigned tasks, and together add up to 100%.
export function computeMemberTaskStats(tasks, memberId, doneKey) {
  const memberTasks = tasks.filter((t) => t.assignees?.includes(memberId));
  const activeTasks = memberTasks.filter((t) => t.status !== doneKey).length;
  const completedTasks = memberTasks.filter((t) => t.status === doneKey).length;
  const total = memberTasks.length;

  return {
    activeTasks,
    completedTasks,
    completedPct: total ? Math.round((completedTasks / total) * 100) : 0,
    activePct: total ? Math.round((activeTasks / total) * 100) : 0,
  };
}

/** Resolves the "done" task status key from Master Data, with a safe fallback. */
export function resolveDoneKey(taskStatuses) {
  return taskStatuses.find((s) => s.name.toLowerCase() === "done")?.key || "done";
}
