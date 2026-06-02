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
  Trash2,
  Download,
  FolderPlus,
  HardDrive,
  X,
  Check,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileItem {
  name: string;
  size: string;
  createdAt: string;
  type: "file" | "folder";
}

interface StorageInfo {
  used: string;
  free: string;
  total: string;
  usedPercent: string;
  usedBytes: number;
  totalBytes: number;
}

interface Toast {
  id: number;
  message: string;
  kind: "success" | "error";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getIcon(name: string, type: string) {
  if (type === "folder") return <Folder size={34} />;
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return <Image size={34} />;
  if (["mp4", "mov", "avi", "mkv"].includes(ext)) return <Video size={34} />;
  if (["mp3", "wav", "flac", "ogg"].includes(ext)) return <Music size={34} />;
  if (["zip", "tar", "gz", "rar", "7z"].includes(ext))
    return <Archive size={34} />;
  return <FileText size={34} />;
}

function getColor(name: string, type: string): string {
  if (type === "folder") return "#facc15";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return "#a78bfa";
  if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "#f87171";
  if (["mp3", "wav", "flac", "ogg"].includes(ext)) return "#34d399";
  if (["zip", "tar", "gz", "rar", "7z"].includes(ext)) return "#f59e0b";
  if (["txt", "log", "md"].includes(ext)) return "#22d3ee";
  return "#60a5fa";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const API = "/api"; // proxied through Next.js API routes

// ─── Component ────────────────────────────────────────────────────────────────

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filtered, setFiltered] = useState<FileItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderMsg, setFolderMsg] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastIdRef   = useRef(0);

  // ── Toast ────────────────────────────────────────────────────────────────────

  const showToast = useCallback((message: string, kind: "success" | "error") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── fetchFiles ───────────────────────────────────────────────────────────────

  const fetchFiles = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`${API}/files`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FileItem[] = await res.json();
      setFiles(data);
      setError(null);
    } catch {
      setError("Could not load files. Retrying…");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── fetchStorage ─────────────────────────────────────────────────────────────

  const fetchStorage = useCallback(async () => {
    try {
      const res = await fetch(`${API}/storage-info`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StorageInfo = await res.json();
      setStorageInfo(data);
    } catch {
      // non-fatal
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    fetchStorage();
    const interval = setInterval(() => {
      fetchFiles(true);
      fetchStorage();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchFiles, fetchStorage]);

  // ── Search filter ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(files);
    } else {
      setFiltered(
        files.filter((f) =>
          f.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, files]);

  // ── uploadFile ───────────────────────────────────────────────────────────────

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/upload`, { method: "POST", body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast("File uploaded successfully!", "success");
      await fetchFiles(true);
    } catch {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ── deleteFile ───────────────────────────────────────────────────────────────

  const deleteFile = async (name: string, type: "file" | "folder") => {
    if (!confirm(`Move "${name}" to recycle bin?`)) return;
    try {
      const endpoint =
        type === "folder"
          ? `${API}/folder/${encodeURIComponent(name)}`
          : `${API}/files/${encodeURIComponent(name)}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast(`"${name}" moved to recycle bin.`, "success");
      await fetchFiles(true);
    } catch {
      showToast("Delete failed. Please try again.", "error");
    }
  };

  // ── downloadFile ─────────────────────────────────────────────────────────────

  const downloadFile = (name: string) => {
    window.open(
      `http://146.190.73.142:5000/download/${encodeURIComponent(name)}`,
      "_blank"
    );
  };

  // ── createFolder ─────────────────────────────────────────────────────────────

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setFolderMsg(null);
    try {
      const res = await fetch(`${API}/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFolderMsg("Folder created successfully!");
      showToast("Folder created!", "success");
      await fetchFiles(true);
      setTimeout(() => {
        setShowNewFolder(false);
        setNewFolderName("");
        setFolderMsg(null);
      }, 1500);
    } catch {
      setFolderMsg("Failed to create folder.");
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

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
            top: `${(i * 37 + 11) % 100}%`,
            left: `${(i * 53 + 7) % 100}%`,
            animationDuration: `${12 + (i % 5) * 2}s`,
            animationDelay: `${(i % 5) * 1}s`,
          }}
        >
          <Folder size={40 + (i % 3) * 20} color="rgba(255,255,255,0.25)" />
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
      {/* TOAST STACK */}
      {/* ========================================================= */}

      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border text-base font-semibold shadow-2xl backdrop-blur-xl pointer-events-auto transition-all duration-300 ${
              t.kind === "success"
                ? "bg-green-500/15 border-green-400/30 text-green-300"
                : "bg-red-500/15 border-red-400/30 text-red-300"
            }`}
          >
            {t.kind === "success" ? <Check size={18} /> : <X size={18} />}
            {t.message}
          </div>
        ))}
      </div>

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

          <div className="flex items-center gap-4">

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={uploadFile}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Upload size={22} />
              {uploading ? "Uploading…" : "Upload File"}
            </button>

            <button
              onClick={() => setShowNewFolder(true)}
              className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.35)]"
            >
              <FolderPlus size={22} />
              New Folder
            </button>

          </div>

        </div>

        {/* ── Storage Usage Card ── */}
        {storageInfo && (
          <div className="bg-[#071120]/70 border border-white/10 rounded-[28px] p-7 backdrop-blur-2xl mb-10">
            <div className="flex items-center gap-3 mb-5">
              <HardDrive size={22} className="text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Storage Usage</h2>
            </div>
            <div className="flex gap-8 mb-5">
              <div>
                <p className="text-slate-400 text-sm mb-1">Used</p>
                <p className="text-2xl font-black text-white">{storageInfo.used}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Free</p>
                <p className="text-2xl font-black text-green-400">{storageInfo.free}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Total</p>
                <p className="text-2xl font-black text-slate-300">{storageInfo.total}</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                style={{ width: `${storageInfo.usedPercent}%` }}
              />
            </div>
            <p className="text-slate-500 text-sm mt-2">{storageInfo.usedPercent}% used</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-6 text-lg">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-10 max-w-xl">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={22}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-lg outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
          />
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-slate-400 text-lg mb-6 animate-pulse">Loading files…</p>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Folder size={64} className="mb-4 opacity-30" />
            <p className="text-xl font-semibold">No files found</p>
            <p className="text-sm mt-1">Upload a file or create a folder to get started.</p>
          </div>
        )}

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map((file, index) => {
            const color = getColor(file.name, file.type);
            const icon  = getIcon(file.name, file.type);

            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-[#071120]/70 border border-white/10 rounded-[28px] p-7 backdrop-blur-2xl hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
              >

                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />

                {/* Action buttons — top right */}
                <div className="absolute top-5 right-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  {file.type === "file" && (
                    <button
                      onClick={() => downloadFile(file.name)}
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-cyan-500/30 flex items-center justify-center transition-colors"
                      title="Download"
                    >
                      <Download size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteFile(file.name, file.type)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Icon */}
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                  style={{
                    background: `${color}20`,
                    color: color,
                    boxShadow: `0 0 25px ${color}40`,
                  }}
                >
                  {icon}
                </div>

                {/* File Name */}
                <h2 className="text-2xl font-bold mb-2 truncate pr-10">
                  {file.name}
                </h2>

                {/* Type badge + Size */}
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-2 py-1 rounded-lg font-semibold uppercase tracking-wide"
                    style={{ background: `${color}20`, color }}
                  >
                    {file.type}
                  </span>
                  <p className="text-slate-400 text-lg">{file.size}</p>
                </div>

                {/* Created date */}
                <p className="text-slate-600 text-sm mt-1">
                  {formatDate(file.createdAt)}
                </p>

                {/* Bottom Line */}
                <div
                  className="absolute bottom-0 left-0 h-[3px] w-full"
                  style={{
                    background: `linear-gradient(to right, ${color}, transparent)`,
                  }}
                />

              </div>
            );
          })}

        </div>

      </div>

      {/* ========================================================= */}
      {/* NEW FOLDER MODAL */}
      {/* ========================================================= */}

      {showNewFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#071120] border border-white/10 rounded-[28px] p-8 w-full max-w-md shadow-[0_0_60px_rgba(34,211,238,0.15)]">
            <h2 className="text-2xl font-black text-white mb-6">New Folder</h2>
            <input
              autoFocus
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createFolder();
                if (e.key === "Escape") {
                  setShowNewFolder(false);
                  setNewFolderName("");
                  setFolderMsg(null);
                }
              }}
              placeholder="Folder name..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg outline-none focus:border-cyan-400 transition-all mb-4"
            />
            {folderMsg && (
              <p className={`text-sm mb-4 ${folderMsg.includes("success") ? "text-green-400" : "text-red-400"}`}>
                {folderMsg}
              </p>
            )}
            <div className="flex gap-4">
              <button
                onClick={createFolder}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewFolder(false);
                  setNewFolderName("");
                  setFolderMsg(null);
                }}
                className="flex-1 bg-white/10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
          0% { transform: translateX(-20%); }
          100% { transform: translateX(20%); }
        }

        @keyframes dataMove2 {
          0% { transform: translateX(20%); }
          100% { transform: translateX(-20%); }
        }

        @keyframes floatFile {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(8deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes pingSlow {
          0% { transform: scale(0.8); opacity: 0.2; }
          70% { transform: scale(1.3); opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes pingSlow2 {
          0% { transform: scale(0.7); opacity: 0.2; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { opacity: 0; }
        }

      `}</style>

    </main>
  );
}