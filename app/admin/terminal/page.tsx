"use client";

import { useEffect, useRef, useState } from "react";

export default function TerminalPage() {

  const [lines, setLines] = useState<string[]>([
    "Connecting to SAHA VPS...",
    "Authentication successful.",
    "Loading server modules...",
    "System online.",
  ]);

  const [command, setCommand] = useState("");

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines]);

  const runCommand = (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim()) return;

    setLines((prev) => [
      ...prev,
      `root@saha-vps:~$ ${command}`,
      `Executing "${command}"...`,
    ]);

    setCommand("");
  };

  return (

    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* ================= BACKGROUND ================= */}

      {/* Base */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Matrix Glow */}
      <div className="absolute top-[-300px] left-[10%] w-[800px] h-[800px] bg-green-500/10 blur-[180px] rounded-full" />

      <div className="absolute bottom-[-300px] right-[10%] w-[800px] h-[800px] bg-cyan-500/10 blur-[180px] rounded-full" />

      {/* Cyber Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,120,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,120,0.15) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      {/* Horizontal Data Streams */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[15%] left-0 w-full h-[1px] bg-green-500/20" />
        <div className="absolute top-[35%] left-0 w-full h-[1px] bg-cyan-500/20" />
        <div className="absolute top-[55%] left-0 w-full h-[1px] bg-green-500/20" />
        <div className="absolute top-[75%] left-0 w-full h-[1px] bg-cyan-500/20" />

        {/* Moving Packets */}
        <div className="absolute top-[15%] left-[-20%] w-40 h-[3px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-dataX" />

        <div className="absolute top-[35%] right-[-20%] w-40 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-dataX2" />

        <div className="absolute top-[55%] left-[-20%] w-40 h-[3px] bg-gradient-to-r from-transparent via-green-300 to-transparent animate-dataX" />

        <div className="absolute top-[75%] right-[-20%] w-40 h-[3px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-dataX2" />

      </div>

      {/* Floating Terminal Windows */}

      <div className="absolute top-16 left-16 w-72 h-44 rounded-3xl border border-green-500/20 bg-black/30 backdrop-blur-xl shadow-[0_0_40px_rgba(34,197,94,0.15)] animate-float overflow-hidden">

        <div className="flex gap-2 px-4 py-3 border-b border-green-500/10">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        <div className="p-4 font-mono text-green-400 text-sm leading-7">
          <p>$ npm run dev</p>
          <p>✔ Server Started</p>
          <p>✔ Database Connected</p>
          <p>✔ VPS Online</p>
        </div>

      </div>

      {/* Floating Code Block */}

      <div className="absolute bottom-16 right-16 w-80 h-52 rounded-3xl border border-cyan-500/20 bg-black/30 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] animate-float2 overflow-hidden">

        <div className="flex gap-2 px-4 py-3 border-b border-cyan-500/10">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        <div className="p-4 font-mono text-cyan-300 text-sm leading-7">
          <p>server.listen(8080)</p>
          <p>ssh root@saha-vps</p>
          <p>tailwind.config.js</p>
          <p>systemctl restart nginx</p>
          <p>docker compose up</p>
        </div>

      </div>

      {/* Falling Binary */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500/10 text-sm font-mono animate-binary"
            style={{
              left: `${i * 6}%`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            101010101010
            <br />
            110011001100
            <br />
            001100110011
            <br />
            111100001111
          </div>
        ))}

      </div>

      {/* ================= TERMINAL ================= */}

      <div className="relative z-10 p-10">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-6xl font-black bg-gradient-to-r from-green-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            VPS TERMINAL
          </h1>

          <p className="text-slate-400 text-xl mt-4">
            Secure shell access to your infrastructure
          </p>

        </div>

        {/* Terminal Box */}
        <div className="bg-black/40 border border-green-500/20 rounded-[32px] backdrop-blur-2xl overflow-hidden shadow-[0_0_80px_rgba(34,197,94,0.15)]">

          {/* Terminal Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-green-500/10 bg-black/30">

            <div className="w-4 h-4 rounded-full bg-red-500" />
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <div className="w-4 h-4 rounded-full bg-green-500" />

            <span className="ml-4 text-green-300 font-mono">
              root@saha-vps
            </span>

          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="h-[600px] overflow-y-auto p-6 font-mono text-green-400"
          >

            {lines.map((line, index) => (
              <div
                key={index}
                className="mb-3 text-lg"
              >
                {line}
              </div>
            ))}

            {/* Input */}
            <form
              onSubmit={runCommand}
              className="flex items-center gap-3 mt-4"
            >

              <span className="text-cyan-400 text-lg">
                root@saha-vps:~$
              </span>

              <input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                autoFocus
                className="bg-transparent outline-none flex-1 text-lg text-green-300"
                placeholder="Enter command..."
              />

            </form>

          </div>

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style jsx>{`

        .animate-dataX {
          animation: dataX 5s linear infinite;
        }

        .animate-dataX2 {
          animation: dataX2 6s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float2 {
          animation: float2 8s ease-in-out infinite;
        }

        .animate-binary {
          animation: binary 10s linear infinite;
        }

        @keyframes dataX {

          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(160vw);
          }

        }

        @keyframes dataX2 {

          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-160vw);
          }

        }

        @keyframes float {

          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-18px);
          }

        }

        @keyframes float2 {

          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(18px);
          }

        }

        @keyframes binary {

          0% {
            transform: translateY(-120%);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          100% {
            transform: translateY(120vh);
            opacity: 0;
          }

        }

      `}</style>

    </main>

  );
}