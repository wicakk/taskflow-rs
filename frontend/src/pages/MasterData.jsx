import React, { useState } from "react";
import { Database, Flag, Kanban, FolderKanban, Tag, Building2, Briefcase, ShieldAlert } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useTasksStore } from "../hooks/useTasksStore";
import Card from "../components/common/Card";
import MasterListEditor from "../components/masterdata/MasterListEditor";

const subMenu = [
  { key: "taskStatuses", label: "Task Status", icon: Kanban },
  { key: "priorities", label: "Priority", icon: Flag },
  { key: "projectStatuses", label: "Project Status", icon: FolderKanban },
  { key: "labels", label: "Labels", icon: Tag },
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "jobTitles", label: "Job Titles", icon: Briefcase },
];

export default function MasterData() {
  const { c } = useTheme();
  const { can } = useAuth();
  const { tasks, projects, teamMembers } = useTasksStore();
  const [active, setActive] = useState("taskStatuses");

  if (!can("master:manage")) {
    return (
      <Card className="p-16 flex flex-col items-center justify-center text-center">
        <ShieldAlert size={26} style={{ color: c.muted }} className="mb-3" />
        <div className="text-[14px] font-semibold" style={{ color: c.textStrong }}>Access restricted</div>
        <p className="text-[12.5px] mt-1" style={{ color: c.muted }}>Only Admins can manage master data.</p>
      </Card>
    );
  }

  const usage = {
    taskStatuses: (item) => tasks.filter((t) => t.status === item.key).length,
    priorities: (item) => tasks.filter((t) => t.priority === item.name).length + projects.filter((p) => p.priority === item.name).length,
    projectStatuses: (item) => projects.filter((p) => p.status === item.name).length,
    labels: (item) => tasks.filter((t) => t.labels.includes(item.name)).length,
    departments: (item) => projects.filter((p) => p.department === item.name).length,
    jobTitles: (item) => teamMembers.filter((m) => m.role === item.name).length,
  };

  const usageNoun = {
    taskStatuses: "task",
    priorities: "item",
    projectStatuses: "project",
    labels: "task",
    departments: "project",
    jobTitles: "member",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "#EDEBFD" }}>
          <Database size={17} color="#7367F0" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: c.textStrong }}>Master Data</h1>
          <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>Kelola data acuan yang dipakai di seluruh aplikasi.</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-0.5" style={{ borderBottom: `1px solid ${c.border}` }}>
        {subMenu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className="px-4 py-2.5 text-[13px] font-medium whitespace-nowrap relative flex items-center gap-1.5"
              style={{ color: isActive ? "#7367F0" : c.muted }}
            >
              <Icon size={14} />
              {item.label}
              {isActive && <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full" style={{ background: "#7367F0" }} />}
            </button>
          );
        })}
      </div>

      {active === "taskStatuses" && (
        <MasterListEditor
          listName="taskStatuses"
          header={{ title: "Task Status (Kanban Columns)", subtitle: "Urutan di sini menentukan urutan kolom papan Kanban. Nama & warna bisa diubah kapan saja." }}
          colorEnabled
          reorderEnabled
          getUsageCount={usage.taskStatuses}
          usageNoun={usageNoun.taskStatuses}
          namePlaceholder="e.g. Testing, Blocked"
        />
      )}
      {active === "priorities" && (
        <MasterListEditor
          listName="priorities"
          header={{ title: "Priority Levels", subtitle: "Dipakai di dropdown priority pada Task dan Project." }}
          colorEnabled
          getUsageCount={usage.priorities}
          usageNoun={usageNoun.priorities}
          namePlaceholder="e.g. Urgent"
        />
      )}
      {active === "projectStatuses" && (
        <MasterListEditor
          listName="projectStatuses"
          header={{ title: "Project Status", subtitle: "Dipakai di dropdown status saat membuat/mengedit project." }}
          colorEnabled
          getUsageCount={usage.projectStatuses}
          usageNoun={usageNoun.projectStatuses}
          namePlaceholder="e.g. On Hold"
        />
      )}
      {active === "labels" && (
        <MasterListEditor
          listName="labels"
          header={{ title: "Task Labels", subtitle: "Dipakai sebagai pilihan label/tag saat membuat atau mengedit task." }}
          colorEnabled
          getUsageCount={usage.labels}
          usageNoun={usageNoun.labels}
          namePlaceholder="e.g. Mobile"
        />
      )}
      {active === "departments" && (
        <MasterListEditor
          listName="departments"
          header={{ title: "Departments / Units", subtitle: "Unit atau modul rumah sakit yang bisa dikaitkan ke sebuah project." }}
          descriptionEnabled
          getUsageCount={usage.departments}
          usageNoun={usageNoun.departments}
          namePlaceholder="e.g. Radiologi"
        />
      )}
      {active === "jobTitles" && (
        <MasterListEditor
          listName="jobTitles"
          header={{ title: "Job Titles", subtitle: "Dipakai di dropdown jabatan saat menambah anggota tim." }}
          getUsageCount={usage.jobTitles}
          usageNoun={usageNoun.jobTitles}
          namePlaceholder="e.g. DevOps Engineer"
        />
      )}
    </div>
  );
}
