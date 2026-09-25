import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useTasksStore } from "../hooks/useTasksStore";
import { useMasterData } from "../hooks/useMasterData";
import { computeMemberTaskStats, resolveDoneKey } from "../utils/memberStats";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import TeamCard from "../components/team/TeamCard";
import MemberFormModal from "../components/team/MemberFormModal";

export default function Team() {
  const { c } = useTheme();
  const { user, can } = useAuth();
  const { teamMembers, tasks, deleteMember } = useTasksStore();
  const { taskStatuses } = useMasterData();
  const doneKey = resolveDoneKey(taskStatuses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const manageTeam = can("team:manage");

  const openCreate = () => {
    setEditingMember(null);
    setModalOpen(true);
  };
  const openEdit = (m) => {
    setEditingMember(m);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: c.textStrong }}>Teams</h1>
          <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>See workload and activity across the team.</p>
        </div>
        {manageTeam && (
          <Button icon={UserPlus} onClick={openCreate}>Add Member</Button>
        )}
      </div>

      {!manageTeam && (
        <Card className="p-3.5 px-4">
          <p className="text-[12.5px]" style={{ color: c.muted }}>
            Only Admins can add, edit, or remove team members and change access roles.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {teamMembers.map((m) => (
          <TeamCard
            key={m.id}
            member={{ ...m, ...computeMemberTaskStats(tasks, m.id, doneKey) }}
            onEdit={manageTeam ? () => openEdit(m) : undefined}
            onDelete={manageTeam && m.id !== user?.id ? () => setDeleteTarget(m) : undefined}
          />
        ))}
      </div>

      <MemberFormModal open={modalOpen} onClose={() => setModalOpen(false)} member={editingMember} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this member?"
        message={`"${deleteTarget?.name}" will lose access to TaskFlow and be removed from the tasks and projects they were assigned to.`}
        confirmLabel="Remove"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteMember(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
