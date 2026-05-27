"use client";

import {
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Upload,
  Search,
} from "lucide-react";

export default function FilesPage() {
  const files = [
    {
      name: "Project_Backup.zip",
      size: "1.2 GB",
      icon: <Archive size={34} />,
      color: "#f59e0b",
    },
    {
      name: "server_logs.txt",
      size: "24 MB",
      icon: <FileText size={34} />,
      color: "#22d3ee",
    },
  
    {
      name: "Documents",
      size: "Folder",
      icon: <Folder size={34} />,
      color: "#facc15",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* ========================================================= */}
      {/* FILE SYSTEM BACKGROUND */}
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

      {/* Glow */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />

      <div className="absolute bottom-[-250px] right-[-100px] w-[600px] h-[600px] bg-blue-500/10 blur-[160px] rounded-full" />

      {/* Floating File Icons */}
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-floatFile opacity-10"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${12 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          <Folder
            size={40 + Math.random() * 40}
            color="rgba(255,255,255,0.25)"
          />
        </div>
      ))}

      {/* Data Lines */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[20%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-dataMove" />

        <div className="absolute top-[45%] right-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-dataMove2" />

        <div className="absolute top-[70%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-dataMove" />

      </div>

      {/* Upload Waves */}
      <div className="absolute top-[20%] right-[10%] w-72 h-72 border border-cyan-500/10 rounded-full animate-pingSlow" />

      <div className="absolute top-[20%] right-[10%] w-96 h-96 border border-blue-500/10 rounded-full animate-pingSlow2" />

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

      <div className="relative z-10 p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              FILE STORAGE
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Manage your VPS files and folders
            </p>

          </div>

          <button className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <Upload size={22} />
            Upload File
          </button>

           <button className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <Upload size={22} />
            Download File
          </button>

        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-xl">

          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={22}
          />

          <input
            type="text"
            placeholder="Search files..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-lg outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
          />

        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {files.map((file, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-[#071120]/70 border border-white/10 rounded-[28px] p-7 backdrop-blur-2xl hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
            >

              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />

              {/* Icon */}
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{
                  background: `${file.color}20`,
                  color: file.color,
                  boxShadow: `0 0 25px ${file.color}40`,
                }}
              >
                {file.icon}
              </div>

              {/* File Name */}
              <h2 className="text-2xl font-bold mb-2">
                {file.name}
              </h2>

              {/* Size */}
              <p className="text-slate-400 text-lg">
                {file.size}
              </p>

              {/* Bottom Line */}
              <div
                className="absolute bottom-0 left-0 h-[3px] w-full"
                style={{
                  background: `linear-gradient(to right, ${file.color}, transparent)`,
                }}
              />

            </div>
          ))}

        </div>

      </div>

      {/* ========================================================= */}
      {/* ANIMATIONS */}
      {/* ========================================================= */}

      <style jsx>{`

        .animate-dataMove {
          animation: dataMove 10s linear infinite;
        }

        .animate-dataMove2 {
          animation: dataMove2 12s linear infinite;
        }

        .animate-floatFile {
          animation: floatFile linear infinite;
        }

        .animate-pingSlow {
          animation: pingSlow 8s linear infinite;
        }

        .animate-pingSlow2 {
          animation: pingSlow 12s linear infinite;
        }

        @keyframes dataMove {

          0% {
            transform: translateX(-20%);
          }

          100% {
            transform: translateX(20%);
          }

        }

        @keyframes dataMove2 {

          0% {
            transform: translateX(20%);
          }

          100% {
            transform: translateX(-20%);
          }

        }

        @keyframes floatFile {

          0% {
            transform: translateY(0px) rotate(0deg);
          }

          50% {
            transform: translateY(-30px) rotate(8deg);
          }

          100% {
            transform: translateY(0px) rotate(0deg);
          }

        }

        @keyframes pingSlow {

          0% {
            transform: scale(0.8);
            opacity: 0.2;
          }

          70% {
            transform: scale(1.3);
            opacity: 0;
          }

          100% {
            opacity: 0;
          }

        }

        @keyframes pingSlow2 {

          0% {
            transform: scale(0.7);
            opacity: 0.2;
          }

          70% {
            transform: scale(1.5);
            opacity: 0;
          }

          100% {
            opacity: 0;
          }

        }

      `}</style>

    </main>
  );
}