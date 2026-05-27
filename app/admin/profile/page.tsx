"use client";

import {
  User,
  Mail,
  Lock,
  Shield,
  Camera,
  Bell,
  Globe,
  Server,
} from "lucide-react";

export default function ProfilePage() {

  return (

    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white p-10">

      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      {/* Main Background */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] rounded-full" />

      <div className="absolute bottom-[-250px] right-[-100px] w-[700px] h-[700px] bg-purple-500/10 blur-[180px] rounded-full" />

      {/* Floating Icons */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-floatIcon opacity-10"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          <User
            size={35 + Math.random() * 35}
            color="rgba(255,255,255,0.25)"
          />
        </div>
      ))}

      {/* Data Lines */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[20%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-lineMove" />

        <div className="absolute top-[50%] right-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-lineMove2" />

        <div className="absolute top-[75%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-lineMove" />

      </div>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-10">

          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            USER PROFILE
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Manage your account information and security.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ========================================================= */}
          {/* PROFILE CARD */}
          {/* ========================================================= */}

          <div className="bg-[#071120]/70 border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl hover:border-cyan-400/30 transition-all duration-500">

            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-10">

              <div className="relative">

                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 p-[3px] animate-avatarGlow">

                  <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center text-4xl font-bold">
                    A
                  </div>

                </div>

                <button className="absolute bottom-0 right-0 bg-cyan-500 p-2 rounded-full hover:scale-110 transition-all">

                  <Camera size={16} />

                </button>

              </div>

              <div>

                <h2 className="text-3xl font-bold">
                  Admin
                </h2>

                <p className="text-slate-400 mt-2">
                  admin@gmail.com
                </p>

                <div className="flex items-center gap-2 mt-3 text-cyan-300 text-sm">

                  <Shield size={16} />

                  Super Administrator

                </div>

              </div>

            </div>

            {/* Form */}
            <div className="space-y-6">

              <div>

                <label className="flex items-center gap-2 text-slate-300 mb-3">

                  <User size={18} />

                  Full Name

                </label>

                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all"
                />

              </div>

              <div>

                <label className="flex items-center gap-2 text-slate-300 mb-3">

                  <Mail size={18} />

                  Email Address

                </label>

                <input
                  type="email"
                  defaultValue="admin@gmail.com"
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all"
                />

              </div>

              <button className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:scale-[1.02] transition-all duration-300 py-4 rounded-2xl text-lg font-bold shadow-[0_0_30px_rgba(34,211,238,0.35)]">

                Save Changes

              </button>

            </div>

          </div>

          {/* ========================================================= */}
          {/* SECURITY CARD */}
          {/* ========================================================= */}

          <div className="space-y-8">

            {/* Security */}
            <div className="bg-[#071120]/70 border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl hover:border-purple-400/30 transition-all duration-500">

              <h2 className="text-3xl font-bold mb-8">
                Security Settings
              </h2>

              <div className="space-y-6">

                <div>

                  <label className="flex items-center gap-2 text-slate-300 mb-3">

                    <Lock size={18} />

                    Current Password

                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
                  />

                </div>

                <div>

                  <label className="flex items-center gap-2 text-slate-300 mb-3">

                    <Lock size={18} />

                    New Password

                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
                  />

                </div>

                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-[1.02] transition-all duration-300 py-4 rounded-2xl text-lg font-bold shadow-[0_0_30px_rgba(34,197,94,0.35)]">

                  Update Password

                </button>

              </div>

            </div>

            {/* Quick Settings */}
            <div className="bg-[#071120]/70 border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl">

              <h2 className="text-3xl font-bold mb-8">
                Quick Settings
              </h2>

              <div className="space-y-5">

                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-5">

                  <div className="flex items-center gap-4">

                    <Bell className="text-yellow-400" />

                    <div>

                      <h3 className="font-semibold">
                        Notifications
                      </h3>

                      <p className="text-slate-400 text-sm">
                        Server alerts & updates
                      </p>

                    </div>

                  </div>

                  <button className="px-4 py-2 rounded-xl bg-yellow-500/15 border border-yellow-400/20 hover:bg-yellow-500/25 transition-all">

                    Enabled

                  </button>

                </div>

                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-5">

                  <div className="flex items-center gap-4">

                    <Globe className="text-cyan-400" />

                    <div>

                      <h3 className="font-semibold">
                        Region
                      </h3>

                      <p className="text-slate-400 text-sm">
                        Asia - India
                      </p>

                    </div>

                  </div>

                  <button className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/20 hover:bg-cyan-500/25 transition-all">

                    Active

                  </button>

                </div>

                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-5">

                  <div className="flex items-center gap-4">

                    <Server className="text-purple-400" />

                    <div>

                      <h3 className="font-semibold">
                        VPS Status
                      </h3>

                      <p className="text-slate-400 text-sm">
                        All servers running
                      </p>

                    </div>

                  </div>

                  <button className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/20 hover:bg-purple-500/25 transition-all">

                    Online

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* ANIMATIONS */}
      {/* ========================================================= */}

      <style jsx>{`

        .animate-floatIcon {
          animation: floatIcon linear infinite;
        }

        .animate-lineMove {
          animation: lineMove 10s linear infinite;
        }

        .animate-lineMove2 {
          animation: lineMove2 12s linear infinite;
        }

        .animate-avatarGlow {
          animation: avatarGlow 4s ease-in-out infinite;
        }

        @keyframes floatIcon {

          0% {
            transform: translateY(0px) rotate(0deg);
          }

          50% {
            transform: translateY(-25px) rotate(8deg);
          }

          100% {
            transform: translateY(0px) rotate(0deg);
          }

        }

        @keyframes lineMove {

          0% {
            transform: translateX(-20%);
          }

          100% {
            transform: translateX(20%);
          }

        }

        @keyframes lineMove2 {

          0% {
            transform: translateX(20%);
          }

          100% {
            transform: translateX(-20%);
          }

        }

        @keyframes avatarGlow {

          0%,100% {
            box-shadow: 0 0 30px rgba(34,211,238,0.35);
          }

          50% {
            box-shadow: 0 0 60px rgba(168,85,247,0.45);
          }

        }

      `}</style>

    </main>

  );
}