"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function TerminalPage() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Connecting to VPS SSH server...",
  ]);

  const socketRef = useRef<Socket | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socketRef.current = socket;

    socket.on("connect", () => {
      setHistory((prev) => [...prev, "✅ Connected to terminal backend"]);
    });

    socket.on("output", (data: string) => {
      setHistory((prev) => [...prev, data]);
    });

    socket.on("disconnect", () => {
      setHistory((prev) => [...prev, "❌ Disconnected from terminal backend"]);
    });

    socket.on("connect_error", () => {
      setHistory((prev) => [
        ...prev,
        "❌ Could not connect to backend. Run: node backend/ssh-server.js",
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  const sendCommand = () => {
    const clean = command.trim();

    if (!clean) return;

    socketRef.current?.emit("command", clean);

    setHistory((prev) => [...prev, `root@saha-vps:~$ ${clean}`]);

    setCommand("");
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white p-10">
      <h1 className="text-7xl font-black bg-gradient-to-r from-green-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
        VPS TERMINAL
      </h1>

      <p className="text-slate-400 text-2xl mt-3">
        Real SSH access to your VPS
      </p>

      <div className="mt-10 max-w-6xl rounded-[32px] overflow-hidden border border-white/10 bg-[#02080c] shadow-[0_0_80px_rgba(34,211,238,0.12)]">
        <div className="flex items-center gap-4 px-8 py-5 border-b border-white/10">
          <span className="w-5 h-5 rounded-full bg-red-500" />
          <span className="w-5 h-5 rounded-full bg-yellow-400" />
          <span className="w-5 h-5 rounded-full bg-green-400" />

          <span className="ml-6 text-green-300 font-bold text-xl">
            root@saha-vps
          </span>
        </div>

        <div
          ref={terminalRef}
          className="p-8 h-[600px] font-mono text-lg overflow-y-auto"
        >
          {history.map((line, index) => (
            <pre
              key={index}
              className="text-green-300 whitespace-pre-wrap mb-2"
            >
              {line}
            </pre>
          ))}

          <div className="flex items-center gap-2 mt-4">
            <span className="text-cyan-300">root@saha-vps:~$</span>

            <input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendCommand();
                }
              }}
              autoFocus
              placeholder="Enter command..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
