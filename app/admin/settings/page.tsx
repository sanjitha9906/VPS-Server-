"use client";
export default function SettingsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white p-10">

      {/* ================= BACKGROUND ================= */}

      {/* Dark Background */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      {/* Floating Glows */}
      <div className="absolute top-[-250px] left-[-150px] w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full animate-pulse" />

      <div className="absolute bottom-[-250px] right-[-150px] w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full animate-pulse" />

      {/* Rotating Ring */}
      <div className="absolute top-[15%] right-[10%] w-72 h-72 border border-cyan-500/20 rounded-full animate-spinSlow" />

      <div className="absolute top-[15%] right-[10%] w-52 h-52 border border-blue-500/20 rounded-full animate-spinSlowReverse" />

      {/* Data Lines */}
      <div className="absolute top-[25%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-dataLine" />

      <div className="absolute top-[65%] right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-dataLineReverse" />

      {/* Floating Setting Icons */}
      <div className="absolute top-20 left-24 text-cyan-400/20 text-8xl animate-float">
        ⚙
      </div>

      <div className="absolute bottom-20 right-24 text-blue-400/20 text-8xl animate-float2">
        ⚙
      </div>

      {/* ================= CONTENT ================= */}

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-10">

          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Configure your VPS panel and preferences
          </p>

        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* General Settings */}
          <div className="bg-[#0b1120]/70 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,255,255,0.08)]">

            <h2 className="text-3xl font-bold mb-8 text-cyan-300">
              General Settings
            </h2>

            <div className="space-y-6">

              <div>
                <label className="block text-slate-400 mb-2">
                  Server Name
                </label>

                <input
                  type="text"
                  defaultValue="SAHA CLOUD"
                  className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2">
                  Admin Email
                </label>

                <input
                  type="email"
                  defaultValue="admin@gmail.com"
                  className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2">
                  Time Zone
                </label>

                <select className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition">

                  <option>Asia/Kolkata</option>

                  <option>UTC</option>

                  <option>America/New_York</option>

                </select>
              </div>

              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] transition-all py-4 rounded-2xl font-bold text-lg">
                Save Changes
              </button>

            </div>

          </div>

          {/* Security Settings */}
          <div className="bg-[#0b1120]/70 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.08)]">

            <h2 className="text-3xl font-bold mb-8 text-blue-300">
              Security
            </h2>

            <div className="space-y-6">

              <div>
                <label className="block text-slate-400 mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  className="w-full bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-blue-400 transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2">
                  Two Factor Authentication
                </label>

                <div className="flex items-center justify-between bg-[#020817] border border-slate-700 rounded-2xl px-5 py-4">

                  <span className="text-slate-300">
                    Enable 2FA
                  </span>

                  <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-semibold transition">
                    Enabled
                  </button>

                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-[1.02] transition-all py-4 rounded-2xl font-bold text-lg">
                Update Security
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style jsx>{`

        .animate-spinSlow {
          animation: spinSlow 18s linear infinite;
        }

        .animate-spinSlowReverse {
          animation: spinSlowReverse 14s linear infinite;
        }

        .animate-dataLine {
          animation: dataLine 6s linear infinite;
        }

        .animate-dataLineReverse {
          animation: dataLineReverse 8s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float2 {
          animation: float2 8s ease-in-out infinite;
        }

        @keyframes spinSlow {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }

        @keyframes spinSlowReverse {

          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }

        }

        @keyframes dataLine {

          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }

        }

        @keyframes dataLineReverse {

          0% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(-100%);
          }

        }

        @keyframes float {

          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-20px);
          }

        }

        @keyframes float2 {

          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(20px);
          }

        }

      `}</style>

    </div>
  );
}