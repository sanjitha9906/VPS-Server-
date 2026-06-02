"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function ServerSettingsPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [popup, setPopup] =
    useState("");

  // SERVER CONFIG
  const [serverName, setServerName] =
    useState("SAHA VPS");

  const [ipAddress, setIpAddress] =
    useState("192.168.1.1");

  const [port, setPort] =
    useState("8080");

  // SECURITY
  const [firewall, setFirewall] =
    useState(true);

  const [sshAccess, setSshAccess] =
    useState(true);

  const [autoBackup, setAutoBackup] =
    useState(false);

  // LOADING
  const [savingConfig, setSavingConfig] =
    useState(false);

  const [savingSecurity, setSavingSecurity] =
    useState(false);

  // POPUP
  const showPopup = (
    message: string
  ) => {
    setPopup(message);

    setTimeout(() => {
      setPopup("");
    }, 2500);
  };

  // AUTH + LOAD SETTINGS
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          try {
            if (!user) {
              router.push("/login");
              return;
            }

            // USER DOC
            const userRef = doc(
              db,
              "users",
              user.uid
            );

            const userSnap =
              await getDoc(userRef);

            if (!userSnap.exists()) {
              console.log(
                "User document missing"
              );

              setLoading(false);

              return;
            }

            const userData =
              userSnap.data();

            // ADMIN CHECK
            if (
              userData.role !==
                "admin" &&
              userData.role !==
                "owner"
            ) {
              showPopup(
                "Access denied. Admin only."
              );

              router.push(
                "/admin/dashboard"
              );

              return;
            }

            // SETTINGS DOC
            const settingsRef = doc(
              db,
              "serverSettings",
              "main"
            );

            const settingsSnap =
              await getDoc(settingsRef);

            // CREATE DEFAULT DOC
            if (
              !settingsSnap.exists()
            ) {
              await setDoc(
                settingsRef,
                {
                  serverName:
                    "SAHA VPS",
                  ipAddress:
                    "192.168.1.1",
                  port: "8080",
                  firewall: true,
                  sshAccess: true,
                  autoBackup: false,
                }
              );

              setLoading(false);

              return;
            }

            // LOAD DATA
            const data =
              settingsSnap.data();

            setServerName(
              data.serverName ||
                "SAHA VPS"
            );

            setIpAddress(
              data.ipAddress ||
                "192.168.1.1"
            );

            setPort(
              data.port || "8080"
            );

            setFirewall(
              data.firewall ??
                true
            );

            setSshAccess(
              data.sshAccess ??
                true
            );

            setAutoBackup(
              data.autoBackup ??
                false
            );

            setLoading(false);

          } catch (error) {
            console.log(
              "SERVER SETTINGS ERROR:",
              error
            );

            showPopup(
              "Failed to load settings"
            );

            setLoading(false);
          }
        }
      );

    return () =>
      unsubscribe();
  }, [router]);

  // SAVE CONFIG
  const saveConfiguration =
    async () => {
      try {
        setSavingConfig(true);

        await setDoc(
          doc(
            db,
            "serverSettings",
            "main"
          ),
          {
            serverName,
            ipAddress,
            port,
          },
          { merge: true }
        );

        showPopup(
          "Configuration saved successfully!"
        );

      } catch (error) {
        console.log(error);

        showPopup(
          "Failed to save configuration"
        );

      } finally {
        setSavingConfig(false);
      }
    };

  // SAVE SECURITY
  const saveSecurity =
    async () => {
      try {
        setSavingSecurity(true);

        await setDoc(
          doc(
            db,
            "serverSettings",
            "main"
          ),
          {
            firewall,
            sshAccess,
            autoBackup,
          },
          { merge: true }
        );

        showPopup(
          "Security settings updated!"
        );

      } catch (error) {
        console.log(error);

        showPopup(
          "Failed to update security"
        );

      } finally {
        setSavingSecurity(false);
      }
    };

  // LOADING SCREEN
  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <p className="text-cyan-300 text-2xl animate-pulse">
          Loading Server Settings...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white p-10">

      {/* POPUP */}

      {popup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="bg-[#071120] border border-cyan-400/30 rounded-3xl px-10 py-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] text-center">

            <h2 className="text-2xl font-bold text-cyan-300 mb-3">
              Notification
            </h2>

            <p className="text-white text-lg">
              {popup}
            </p>

          </div>

        </div>
      )}

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-[#020617]" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,255,0.15) 1px, transparent 1px)",
          backgroundSize:
            "55px 55px",
        }}
      />

      <div className="absolute top-[-250px] left-[5%] w-[700px] h-[700px] bg-cyan-500/10 blur-[160px] rounded-full" />

      <div className="absolute bottom-[-250px] right-[5%] w-[700px] h-[700px] bg-blue-600/10 blur-[160px] rounded-full" />

      {/* CONTENT */}

      <div className="relative z-10">

        {/* HEADER */}

        <div className="mb-12">

          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Server Settings
          </h1>

          <p className="text-slate-400 text-xl mt-4">
            Configure your VPS infrastructure and network settings
          </p>

        </div>

        {/* GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* SERVER CONFIG */}

          <div className="bg-[#071120]/70 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_40px_rgba(34,211,238,0.08)]">

            <h2 className="text-3xl font-bold mb-8 text-cyan-300">
              Server Configuration
            </h2>

            <div className="space-y-6">

              <div>

                <label className="block text-slate-300 mb-3">
                  Server Name
                </label>

                <input
                  type="text"
                  value={serverName}
                  onChange={(e) =>
                    setServerName(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />

              </div>

              <div>

                <label className="block text-slate-300 mb-3">
                  IP Address
                </label>

                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) =>
                    setIpAddress(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />

              </div>

              <div>

                <label className="block text-slate-300 mb-3">
                  Port
                </label>

                <input
                  type="number"
                  value={port}
                  onChange={(e) =>
                    setPort(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />

              </div>

              <button
                onClick={
                  saveConfiguration
                }
                disabled={
                  savingConfig
                }
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition"
              >
                {savingConfig
                  ? "Saving..."
                  : "Save Configuration"}
              </button>

            </div>

          </div>

          {/* SECURITY */}

          <div className="bg-[#071120]/70 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.08)]">

            <h2 className="text-3xl font-bold mb-8 text-blue-300">
              Security Settings
            </h2>

            <div className="space-y-6">

              {/* FIREWALL */}

              <div className="flex items-center justify-between bg-black/20 border border-slate-800 rounded-2xl px-5 py-5">

                <div>

                  <h3 className="font-semibold text-lg">
                    Firewall Protection
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Enable advanced firewall security
                  </p>

                </div>

                <button
                  onClick={() =>
                    setFirewall(
                      !firewall
                    )
                  }
                  className={`w-14 h-8 rounded-full relative transition ${
                    firewall
                      ? "bg-green-500"
                      : "bg-slate-700"
                  }`}
                >

                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                      firewall
                        ? "right-1"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              {/* SSH */}

              <div className="flex items-center justify-between bg-black/20 border border-slate-800 rounded-2xl px-5 py-5">

                <div>

                  <h3 className="font-semibold text-lg">
                    SSH Access
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Allow secure shell connections
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSshAccess(
                      !sshAccess
                    )
                  }
                  className={`w-14 h-8 rounded-full relative transition ${
                    sshAccess
                      ? "bg-green-500"
                      : "bg-slate-700"
                  }`}
                >

                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                      sshAccess
                        ? "right-1"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              {/* BACKUP */}

              <div className="flex items-center justify-between bg-black/20 border border-slate-800 rounded-2xl px-5 py-5">

                <div>

                  <h3 className="font-semibold text-lg">
                    Auto Backup
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Daily automated backups
                  </p>

                </div>

                <button
                  onClick={() =>
                    setAutoBackup(
                      !autoBackup
                    )
                  }
                  className={`w-14 h-8 rounded-full relative transition ${
                    autoBackup
                      ? "bg-green-500"
                      : "bg-slate-700"
                  }`}
                >

                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                      autoBackup
                        ? "right-1"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              {/* SAVE */}

              <button
                onClick={
                  saveSecurity
                }
                disabled={
                  savingSecurity
                }
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition"
              >
                {savingSecurity
                  ? "Saving..."
                  : "Save Security Settings"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}