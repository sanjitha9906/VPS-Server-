"use client";

import { useEffect, useState } from "react";

interface Stats {
  status: string;
  cpu: string;
  ram: string;
  storage: string;
  cores: string;
  usedRam: string;
  totalRam: string;
  usedDisk: string;
  totalDisk: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    status: "Offline",
    cpu: "0",
    ram: "0",
    storage: "0",
    cores: "0",
    usedRam: "0",
    totalRam: "0",
    usedDisk: "0",
    totalDisk: "0",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/server-status");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStats({
          status: data.status,
          cpu: String(data.cpu).replace("%", ""),
          ram: String(data.ram).replace("%", ""),
          storage: String(data.disk).replace("%", ""),
          cores: String(data.cpuCores),
          usedRam: data.usedRam,
          totalRam: data.totalRam,
          usedDisk: data.usedDisk,
          totalDisk: data.totalDisk,
        });
        setError(null);
      } catch (err) {
        setStats((prev) => ({ ...prev, status: "Offline" }));
        setError("Could not reach server. Retrying…");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const statusColor =
    stats.status === "Online" ? "text-green-400" : "text-red-400";

  return (
    <>
      {/* ================= BACKGROUND ================= */}

      {/* ================= INTERNET / NETWORK BACKGROUND ================= */}

      <div className="fixed inset-0 overflow-hidden bg-[#020617] z-0">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Main Glow */}
        <div className="absolute top-[-250px] left-[10%] w-[700px] h-[700px] bg-cyan-500/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-300px] right-[10%] w-[700px] h-[700px] bg-blue-600/10 blur-[200px] rounded-full" />

        {/* NETWORK LINES */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="10%" y1="20%" x2="35%" y2="35%" className="network-line" />
          <line x1="35%" y1="35%" x2="60%" y2="25%" className="network-line" />
          <line x1="60%" y1="25%" x2="82%" y2="40%" className="network-line" />
          <line x1="20%" y1="70%" x2="40%" y2="55%" className="network-line" />
          <line x1="40%" y1="55%" x2="70%" y2="65%" className="network-line" />
          <line x1="70%" y1="65%" x2="90%" y2="45%" className="network-line" />
          <line x1="35%" y1="35%" x2="40%" y2="55%" className="network-line" />
          <line x1="60%" y1="25%" x2="70%" y2="65%" className="network-line" />
        </svg>

        {/* NETWORK NODES */}
        <div className="network-node top-[18%] left-[10%]"></div>
        <div className="network-node top-[33%] left-[35%] delay-node"></div>
        <div className="network-node top-[23%] left-[60%]"></div>
        <div className="network-node top-[38%] left-[82%] delay-node"></div>
        <div className="network-node bottom-[20%] left-[20%]"></div>
        <div className="network-node bottom-[35%] left-[40%] delay-node"></div>
        <div className="network-node bottom-[25%] left-[70%]"></div>
        <div className="network-node bottom-[45%] left-[90%] delay-node"></div>

        {/* DATA PACKETS */}
        <div className="packet packet1"></div>
        <div className="packet packet2"></div>
        <div className="packet packet3"></div>
        <div className="packet packet4"></div>

        {/* INTERNET WAVES */}
        <div className="wave-circle wave1"></div>
        <div className="wave-circle wave2"></div>
        <div className="wave-circle wave3"></div>
      </div>

      {/* ================= DASHBOARD ================= */}

      <div className="relative z-10 p-10">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-6xl font-black text-white mb-3">
            Welcome back, Admin 👋
          </h1>

          <p className="text-slate-400 text-xl">
            Here&apos;s what&apos;s happening with your VPS today.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-xl mb-8">
            <svg
              className="animate-spin h-6 w-6 text-cyan-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Fetching server stats…
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-8 text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-7">
          {/* Card 1 */}
          <div className="dashboard-card">
            <h2 className="dashboard-title">Server Status</h2>

            <div className={`${statusColor} text-6xl font-black mt-8`}>
              {stats.status}
            </div>

            <p className="text-slate-400 mt-5 text-lg">Running smoothly</p>
          </div>

          {/* Card 2 */}
          <div className="dashboard-card">
            <h2 className="dashboard-title">CPU Usage</h2>

            <div className="text-purple-400 text-6xl font-black mt-8">
              {stats.cpu}%
            </div>

            <p className="text-slate-400 mt-5 text-lg">{stats.cores} Cores</p>
          </div>

          {/* Card 3 */}
          <div className="dashboard-card">
            <h2 className="dashboard-title">RAM Usage</h2>

            <div className="text-yellow-400 text-6xl font-black mt-8">
              {stats.ram}%
            </div>

            <p className="text-slate-400 mt-5 text-lg">
              {stats.usedRam} / {stats.totalRam}
            </p>
          </div>

          {/* Card 4 */}
          <div className="dashboard-card">
            <h2 className="dashboard-title">Storage</h2>

            <div className="text-cyan-400 text-6xl font-black mt-8">
              {stats.storage}%
            </div>

            <p className="text-slate-400 mt-5 text-lg">
              {stats.usedDisk} / {stats.totalDisk}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
