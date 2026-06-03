"use client";

import { useEffect, useState } from "react";

interface Stats {
  used: string;
  free: string;
  total: string;
  usedPercent: string;
  usedBytes: number;
  freeBytes: number;
  totalBytes: number;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/storage-info`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        setStats(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not connect to VPS backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ================= BACKGROUND ================= */}

      <div className="fixed inset-0 overflow-hidden bg-[#020617] z-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div className="absolute top-[-250px] left-[10%] w-[700px] h-[700px] bg-cyan-500/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-300px] right-[10%] w-[700px] h-[700px] bg-blue-600/10 blur-[200px] rounded-full" />
      </div>

      {/* ================= DASHBOARD ================= */}

      <div className="relative z-10 p-10">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-6xl font-black text-white mb-3">VPS Dashboard</h1>

          <p className="text-slate-400 text-xl">
            Live server storage monitoring
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-cyan-400 text-xl animate-pulse">
            Loading server stats...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-8 text-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Used */}
            <div className="bg-[#071120]/70 border border-white/10 rounded-[28px] p-8 backdrop-blur-2xl">
              <h2 className="text-slate-400 text-lg mb-4">Used Storage</h2>

              <div className="text-red-400 text-5xl font-black">
                {stats.used}
              </div>

              <p className="text-slate-500 mt-4">Currently occupied</p>
            </div>

            {/* Free */}
            <div className="bg-[#071120]/70 border border-white/10 rounded-[28px] p-8 backdrop-blur-2xl">
              <h2 className="text-slate-400 text-lg mb-4">Free Storage</h2>

              <div className="text-green-400 text-5xl font-black">
                {stats.free}
              </div>

              <p className="text-slate-500 mt-4">Available space</p>
            </div>

            {/* Total */}
            <div className="bg-[#071120]/70 border border-white/10 rounded-[28px] p-8 backdrop-blur-2xl">
              <h2 className="text-slate-400 text-lg mb-4">Total Storage</h2>

              <div className="text-cyan-400 text-5xl font-black">
                {stats.total}
              </div>

              <p className="text-slate-500 mt-4">Full VPS capacity</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {stats && (
          <div className="mt-10 bg-[#071120]/70 border border-white/10 rounded-[28px] p-8 backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-white">Storage Usage</h2>

              <span className="text-cyan-400 text-xl font-bold">
                {stats.usedPercent}%
              </span>
            </div>

            <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                style={{
                  width: `${stats.usedPercent}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-slate-400 mt-4">
              <span>{stats.used} used</span>
              <span>{stats.free} free</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
