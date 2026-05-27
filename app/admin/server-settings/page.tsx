"use client";

export default function ServerSettingsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white p-10">

      {/* ================= BACKGROUND ================= */}

      {/* Dark Base */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Network Glow */}
      <div className="absolute top-[-250px] left-[5%] w-[700px] h-[700px] bg-cyan-500/10 blur-[160px] rounded-full" />

      <div className="absolute bottom-[-250px] right-[5%] w-[700px] h-[700px] bg-blue-600/10 blur-[160px] rounded-full" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* Animated Network Lines */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[20%] left-0 w-full h-[2px] bg-cyan-500/20" />
        <div className="absolute top-[50%] left-0 w-full h-[2px] bg-blue-500/20" />
        <div className="absolute top-[75%] left-0 w-full h-[2px] bg-purple-500/20" />

        <div className="absolute left-[20%] top-0 w-[2px] h-full bg-cyan-500/20" />
        <div className="absolute left-[50%] top-0 w-[2px] h-full bg-blue-500/20" />
        <div className="absolute right-[20%] top-0 w-[2px] h-full bg-purple-500/20" />

        {/* Moving Data */}
        <div className="absolute top-[20%] left-[-20%] w-44 h-[4px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-dataX" />

        <div className="absolute top-[50%] right-[-20%] w-44 h-[4px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-dataX2" />

        <div className="absolute top-[75%] left-[-20%] w-44 h-[4px] bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-dataX" />

      </div>

      {/* Floating Server Nodes */}
      <div className="absolute top-20 left-20 w-36 h-36 rounded-3xl border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-xl animate-float shadow-[0_0_50px_rgba(34,211,238,0.2)] flex items-center justify-center">
        <span className="text-cyan-300 font-bold tracking-[4px]">
          VPS
        </span>
      </div>

      <div className="absolute bottom-20 right-20 w-44 h-44 rounded-3xl border border-blue-400/30 bg-blue-500/10 backdrop-blur-xl animate-float2 shadow-[0_0_50px_rgba(59,130,246,0.2)] flex items-center justify-center">
        <span className="text-blue-300 font-bold tracking-[4px]">
          SERVER
        </span>
      </div>

      <div className="absolute top-[40%] right-[15%] w-24 h-24 rounded-2xl border border-purple-400/30 bg-purple-500/10 backdrop-blur-xl animate-float3 shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center justify-center">
        <span className="text-purple-300 text-sm font-bold">
          DNS
        </span>
      </div>

      {/* ================= PAGE CONTENT ================= */}

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-12">

          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Server Settings
          </h1>

          <p className="text-slate-400 text-xl mt-4">
            Configure your VPS infrastructure and network settings
          </p>

        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Server Config */}
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
                  defaultValue="SAHA VPS"
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-3">
                  IP Address
                </label>

                <input
                  type="text"
                  defaultValue="192.168.1.1"
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-3">
                  Port
                </label>

                <input
                  type="number"
                  defaultValue="8080"
                  className="w-full bg-black/30 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition">
                Save Configuration
              </button>

            </div>

          </div>

          {/* Security */}
          <div className="bg-[#071120]/70 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.08)]">

            <h2 className="text-3xl font-bold mb-8 text-blue-300">
              Security Settings
            </h2>

            <div className="space-y-6">

              <div className="flex items-center justify-between bg-black/20 border border-slate-800 rounded-2xl px-5 py-5">
                <div>
                  <h3 className="font-semibold text-lg">
                    Firewall Protection
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Enable advanced firewall security
                  </p>
                </div>

                <div className="w-14 h-8 bg-green-500 rounded-full relative">
                  <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/20 border border-slate-800 rounded-2xl px-5 py-5">
                <div>
                  <h3 className="font-semibold text-lg">
                    SSH Access
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Allow secure shell connections
                  </p>
                </div>

                <div className="w-14 h-8 bg-green-500 rounded-full relative">
                  <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/20 border border-slate-800 rounded-2xl px-5 py-5">
                <div>
                  <h3 className="font-semibold text-lg">
                    Auto Backup
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Daily automated backups
                  </p>
                </div>

                <div className="w-14 h-8 bg-slate-700 rounded-full relative">
                  <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full" />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style jsx>{`

        .animate-dataX {
          animation: dataX 6s linear infinite;
        }

        .animate-dataX2 {
          animation: dataX2 8s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float2 {
          animation: float2 8s ease-in-out infinite;
        }

        .animate-float3 {
          animation: float3 5s ease-in-out infinite;
        }

        @keyframes dataX {

          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(150vw);
          }

        }

        @keyframes dataX2 {

          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-150vw);
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

        @keyframes float3 {

          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-15px);
          }

        }

      `}</style>

    </main>
  );
}