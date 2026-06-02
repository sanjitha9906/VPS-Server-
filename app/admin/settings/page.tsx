"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
  const [serverName, setServerName] = useState("SAHA CLOUD");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [twoFactor, setTwoFactor] = useState(true);

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  const [popup, setPopup] = useState("");

  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2500);
  };

  useEffect(() => {
    const loadSettings = async () => {
      const snap = await getDoc(doc(db, "panelSettings", "main"));

      if (snap.exists()) {
        const data = snap.data();
        setServerName(data.serverName || "SAHA CLOUD");
        setTimeZone(data.timeZone || "Asia/Kolkata");
        setTwoFactor(data.twoFactor ?? true);
      }
    };

    loadSettings();
  }, []);

  const saveGeneralSettings = async () => {
    try {
      setSavingGeneral(true);

      await setDoc(
        doc(db, "panelSettings", "main"),
        {
          serverName,
          timeZone,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      showPopup("General settings saved successfully!");
    } catch (error) {
      console.log(error);
      showPopup("Failed to save general settings");
    } finally {
      setSavingGeneral(false);
    }
  };

  const saveSecuritySettings = async () => {
    try {
      setSavingSecurity(true);

      await setDoc(
        doc(db, "panelSettings", "main"),
        {
          twoFactor,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      showPopup("Panel security saved successfully!");
    } catch (error) {
      console.log(error);
      showPopup("Failed to save security settings");
    } finally {
      setSavingSecurity(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white p-10">
      {popup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#071120] border border-cyan-400/30 rounded-3xl px-10 py-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] text-center">
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">
              Notification
            </h2>
            <p className="text-white text-lg">{popup}</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-[#020617] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      <div className="absolute top-[-250px] left-[-150px] w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-250px] right-[-150px] w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Configure your VPS panel preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#0b1120]/70 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl">
            <h2 className="text-3xl font-bold mb-8 text-cyan-300">
              General Settings
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-400 mb-2">Server Name</label>

                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2">Time Zone</label>

                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>

              <button
                type="button"
                onClick={saveGeneralSettings}
                disabled={savingGeneral}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] transition-all py-4 rounded-2xl font-bold text-lg disabled:opacity-60"
              >
                {savingGeneral ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="bg-[#0b1120]/70 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl">
            <h2 className="text-3xl font-bold mb-8 text-blue-300">
              Panel Security
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-400 mb-2">
                  Two Factor Authentication
                </label>

                <div className="flex items-center justify-between bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4">
                  <span className="text-slate-300">Enable 2FA</span>

                  <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`px-5 py-2 rounded-xl font-semibold transition ${
                      twoFactor ? "bg-green-500" : "bg-slate-600"
                    }`}
                  >
                    {twoFactor ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={saveSecuritySettings}
                disabled={savingSecurity}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-[1.02] transition-all py-4 rounded-2xl font-bold text-lg disabled:opacity-60"
              >
                {savingSecurity ? "Saving..." : "Update Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
