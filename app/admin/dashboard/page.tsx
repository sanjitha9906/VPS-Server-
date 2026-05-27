"use client";

export default function DashboardPage() {
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

    {/* Connection Paths */}

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
            Here's what's happening with your VPS today.
          </p>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-4 gap-7">

          {/* Card 1 */}

          <div className="dashboard-card">

            <h2 className="dashboard-title">
              Server Status
            </h2>

            <div className="text-green-400 text-6xl font-black mt-8">
              Online
            </div>

            <p className="text-slate-400 mt-5 text-lg">
              Running smoothly
            </p>

          </div>

          {/* Card 2 */}

          <div className="dashboard-card">

            <h2 className="dashboard-title">
              CPU Usage
            </h2>

            <div className="text-purple-400 text-6xl font-black mt-8">
              23%
            </div>

            <p className="text-slate-400 mt-5 text-lg">
              4 Cores
            </p>

          </div>

          {/* Card 3 */}

          <div className="dashboard-card">

            <h2 className="dashboard-title">
              RAM Usage
            </h2>

            <div className="text-yellow-400 text-6xl font-black mt-8">
              45%
            </div>

            <p className="text-slate-400 mt-5 text-lg">
              3.6 GB / 8 GB
            </p>

          </div>

          {/* Card 4 */}

          <div className="dashboard-card">

            <h2 className="dashboard-title">
              Storage
            </h2>

            <div className="text-cyan-400 text-6xl font-black mt-8">
              62%
            </div>

            <p className="text-slate-400 mt-5 text-lg">
              124 GB / 200 GB
            </p>

          </div>

        </div>

      </div>
    </>
  );
}