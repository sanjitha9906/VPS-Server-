export default function DashboardPage() {
  return (
    <div>

      <h1 className="text-5xl font-bold mb-3">
        Welcome back, Admin 👋
      </h1>

      <p className="text-slate-400 mb-10 text-lg">
        Here's what's happening with your VPS today.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">

        {/* Server */}
        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            Server Status
          </h2>

          <p className="text-green-400 text-5xl font-bold">
            Online
          </p>

          <p className="text-slate-400 mt-4">
            Running smoothly
          </p>
        </div>

        {/* CPU */}
        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            CPU Usage
          </h2>

          <p className="text-purple-400 text-5xl font-bold">
            23%
          </p>

          <p className="text-slate-400 mt-4">
            4 Cores
          </p>
        </div>

        {/* RAM */}
        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            RAM Usage
          </h2>

          <p className="text-yellow-400 text-5xl font-bold">
            45%
          </p>

          <p className="text-slate-400 mt-4">
            3.6 GB / 8 GB
          </p>
        </div>

        {/* Storage */}
        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            Storage
          </h2>

          <p className="text-cyan-400 text-5xl font-bold">
            62%
          </p>

          <p className="text-slate-400 mt-4">
            124 GB / 200 GB
          </p>
        </div>

      </div>

    </div>
  );
}