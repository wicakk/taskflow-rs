import React, { useState } from "react";
import { Settings as SettingsIcon, RotateCcw } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import Card from "../components/common/Card";
import ConfirmDialog from "../components/common/ConfirmDialog";

export default function Settings() {
  const { c, dark, toggleDark } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);

  const resetDemoData = () => {
    window.localStorage.removeItem("taskflow.data.v1");
    window.localStorage.removeItem("taskflow.masterdata.v1");
    window.location.reload();
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
          <div className="text-[13.5px] font-medium" style={{ color: c.textStrong }}>Reset demo data</div>
          <div className="text-[12px] mt-0.5 max-w-[280px]" style={{ color: c.muted }}>
            Data project, task, chat, pengumuman, dan Master Data disimpan di browser ini. Klik untuk kembalikan ke data contoh awal.
          </div>
        </div>
        <button
          onClick={() => setConfirmReset(true)}
          className="p-2.5 rounded-[10px] shrink-0"
          style={{ border: `1px solid ${c.border}`, color: "#EA5455" }}
        >
          <RotateCcw size={16} />
        </button>
      </Card>

      <Card className="p-10 flex flex-col items-center justify-center text-center max-w-md">
        <SettingsIcon size={26} style={{ color: c.muted }} className="mb-3" />
        <div className="text-[14px] font-semibold" style={{ color: c.textStrong }}>More settings coming soon</div>
      </Card>

      <ConfirmDialog
        open={confirmReset}
        title="Reset semua data ke kondisi awal?"
        message="Semua project, task, chat, dan pengumuman yang sudah kamu buat/ubah di browser ini akan hilang dan kembali ke data contoh awal. Aksi ini tidak bisa dibatalkan."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={resetDemoData}
      />
    </div>
  );
}
