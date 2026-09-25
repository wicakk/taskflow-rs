import React, { useState } from "react";
import { Settings as SettingsIcon, RotateCcw } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import Card from "../components/common/Card";
import { useTasksStore } from "../hooks/useTasksStore";
import { useMasterData } from "../hooks/useMasterData";

export default function Settings() {
  const { c, dark, toggleDark } = useTheme();
  const store = useTasksStore();
  const master = useMasterData();
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([store.reload(), master.reload()]);
    setRefreshing(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold" style={{ color: c.textStrong }}>Settings</h1>
        <p className="text-[13px] mt-0.5" style={{ color: c.muted }}>Preferences for your TaskFlow workspace.</p>
      </div>

      <Card className="p-5 flex items-center justify-between max-w-md">
        <div>
          <div className="text-[13.5px] font-medium" style={{ color: c.textStrong }}>Dark mode</div>
          <div className="text-[12px] mt-0.5" style={{ color: c.muted }}>Switch between light and dark theme.</div>
        </div>
        <button
          onClick={toggleDark}
          className="w-11 h-6 rounded-full relative transition-colors"
          style={{ background: dark ? "#7367F0" : c.border }}
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
            style={{ left: dark ? 22 : 2 }}
          />
        </button>
      </Card>

      <Card className="p-5 flex items-center justify-between max-w-md">
        <div>
          <div className="text-[13.5px] font-medium" style={{ color: c.textStrong }}>Muat ulang data</div>
          <div className="text-[12px] mt-0.5 max-w-[280px]" style={{ color: c.muted }}>
            Semua data (project, task, chat, pengumuman, Master Data) disimpan di database server. Klik untuk mengambil data terbaru.
          </div>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="p-2.5 rounded-[10px] shrink-0"
          style={{ border: `1px solid ${c.border}`, color: "#7367F0", opacity: refreshing ? 0.6 : 1 }}
        >
          <RotateCcw size={16} className={refreshing ? "animate-spin" : ""} />
        </button>
      </Card>

      <Card className="p-10 flex flex-col items-center justify-center text-center max-w-md">
        <SettingsIcon size={26} style={{ color: c.muted }} className="mb-3" />
        <div className="text-[14px] font-semibold" style={{ color: c.textStrong }}>More settings coming soon</div>
      </Card>

    </div>
  );
}
