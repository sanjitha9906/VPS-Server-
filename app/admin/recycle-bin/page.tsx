"use client";

import {
  Trash2,
  RotateCcw,
  FileText,
  Image,
  Video,
  Archive,
  AlertTriangle,
} from "lucide-react";

export default function RecycleBinPage() {

  const deletedFiles = [
    {
      name: "old-backup.zip",
      size: "1.4 GB",
      icon: <Archive size={34} />,
      color: "#f59e0b",
    },
    {
      name: "error-log.txt",
      size: "12 MB",
      icon: <FileText size={34} />,
      color: "#22d3ee",
    },
    {
      name: "deleted-image.png",
      size: "8 MB",
      icon: <Image size={34} />,
      color: "#a855f7",
    },
    {
      name: "removed-video.mp4",
      size: "620 MB",
      icon: <Video size={34} />,
      color: "#3b82f6",
    },
  ];

  return (

    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* ========================================================= */}
      {/* RECYCLE BIN BACKGROUND */}
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

      {/* Red Glow */}
      <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] bg-red-500/10 blur-[180px] rounded-full" />

      <div className="absolute bottom-[-250px] right-[-100px] w-[700px] h-[700px] bg-orange-500/10 blur-[180px] rounded-full" />

      {/* Floating Trash Icons */}
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-trashFloat opacity-10"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          <Trash2
            size={40 + Math.random() * 35}
            color="rgba(255,255,255,0.3)"
          />
        </div>
      ))}

      {/* Data Delete Lines */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[20%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent animate-deleteMove" />

        <div className="absolute top-[50%] right-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent animate-deleteMove2" />

        <div className="absolute top-[75%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-red-400/40 to-transparent animate-deleteMove" />

      </div>

      {/* Danger Waves */}
      <div className="absolute top-[20%] right-[15%] w-72 h-72 border border-red-500/10 rounded-full animate-dangerPulse" />

      <div className="absolute top-[20%] right-[15%] w-96 h-96 border border-orange-500/10 rounded-full animate-dangerPulse2" />

      {/* Floating Warning */}
      <div className="absolute top-[10%] left-[45%] animate-warning">

        <AlertTriangle
          size={90}
          color="rgba(239,68,68,0.15)"
        />

      </div>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

      <div className="relative z-10 p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              RECYCLE BIN
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Deleted files waiting for recovery
            </p>

          </div>

          <button className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_35px_rgba(239,68,68,0.35)]">

            <Trash2 size={22} />

            Empty Bin

          </button>

        </div>

        {/* Deleted Files */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">

          {deletedFiles.map((file, index) => (

            <div
              key={index}
              className="group relative overflow-hidden bg-[#071120]/70 border border-white/10 rounded-[28px] p-7 backdrop-blur-2xl hover:border-red-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]"
            >

              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" />

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
              <p className="text-slate-400 text-lg mb-6">

                {file.size}

              </p>

              {/* Buttons */}
              <div className="flex gap-4">

                <button className="flex items-center gap-2 bg-green-500/15 border border-green-400/20 px-5 py-3 rounded-xl hover:bg-green-500/25 transition-all">

                  <RotateCcw size={18} />

                  Restore

                </button>

                <button className="flex items-center gap-2 bg-red-500/15 border border-red-400/20 px-5 py-3 rounded-xl hover:bg-red-500/25 transition-all">

                  <Trash2 size={18} />

                  Delete

                </button>

              </div>

              {/* Bottom Border */}
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

        .animate-trashFloat {
          animation: trashFloat linear infinite;
        }

        .animate-deleteMove {
          animation: deleteMove 10s linear infinite;
        }

        .animate-deleteMove2 {
          animation: deleteMove2 12s linear infinite;
        }

        .animate-dangerPulse {
          animation: dangerPulse 7s linear infinite;
        }

        .animate-dangerPulse2 {
          animation: dangerPulse2 10s linear infinite;
        }

        .animate-warning {
          animation: warning 5s ease-in-out infinite;
        }

        @keyframes trashFloat {

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

        @keyframes deleteMove {

          0% {
            transform: translateX(-20%);
          }

          100% {
            transform: translateX(20%);
          }

        }

        @keyframes deleteMove2 {

          0% {
            transform: translateX(20%);
          }

          100% {
            transform: translateX(-20%);
          }

        }

        @keyframes dangerPulse {

          0% {
            transform: scale(0.8);
            opacity: 0.2;
          }

          70% {
            transform: scale(1.4);
            opacity: 0;
          }

          100% {
            opacity: 0;
          }

        }

        @keyframes dangerPulse2 {

          0% {
            transform: scale(0.7);
            opacity: 0.2;
          }

          70% {
            transform: scale(1.6);
            opacity: 0;
          }

          100% {
            opacity: 0;
          }

        }

        @keyframes warning {

          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-20px);
          }

        }

      `}</style>

    </main>

  );
}