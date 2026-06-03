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
  AlertTriangle,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

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
  usedPercent: string | number;
  usedBytes?: number;
  freeBytes?: number;
  totalBytes?: number;
}

interface Toast {
  id: number;
  message: string;
  kind: "success" | "error";
}

interface DeleteTarget {
  name: string;
  type: "file" | "folder";
}

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

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.sahalabs.in";

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
  // Custom delete confirmation popup state
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastIdRef = useRef(0);

  const showToast = useCallback(
    (message: string, kind: "success" | "error") => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev, { id, message, kind }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3500,
      );
    },
    [],
  );

  const fetchFiles = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await fetch(`${API}/files?t=${Date.now()}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: FileItem[] = await res.json();
      setFiles(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("FETCH FILES ERROR:", err);
      setError("Could not load files. Retrying…");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStorage = useCallback(async () => {
    try {
      const res = await fetch(`${API}/storage-info?t=${Date.now()}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const used = data.used ?? data.usedStorage ?? "0 GB";
      const free = data.free ?? data.freeStorage ?? "0 GB";
      const total = data.total ?? data.totalStorage ?? "0 GB";

      const usedNum = parseFloat(used);
      const totalNum = parseFloat(total);

      const usedPercent =
        totalNum > 0 ? ((usedNum / totalNum) * 100).toFixed(1) : 0;

      setStorageInfo({
        used,
        free,
        total,
        usedPercent,
      });
    } catch (err) {
      console.error("FETCH STORAGE ERROR:", err);
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

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(files);
    } else {
      setFiltered(
        files.filter((f) =>
          f.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, files]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showToast("File uploaded successfully!", "success");
      await fetchFiles(true);
      await fetchStorage();
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Step 1: show popup by setting deleteTarget
  const confirmDelete = (name: string, type: "file" | "folder") => {
    setDeleteTarget({ name, type });
  };

  // Step 2: actually delete after user clicks OK in popup
  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { name, type } = deleteTarget;

    setDeleting(true);

    try {
      const endpoint =
        type === "folder"
          ? `${API}/folder/${encodeURIComponent(name)}`
          : `${API}/files/${encodeURIComponent(name)}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      showToast(`"${name}" moved to recycle bin.`, "success");
      await fetchFiles(true);
      await fetchStorage();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const downloadFile = (name: string) => {
    window.open(`${API}/download/${encodeURIComponent(name)}`, "_blank");
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    setFolderMsg(null);

    try {
      // Try POST /create-folder first, which is your existing endpoint
      const res = await fetch(`${API}/create-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });

      if (!res.ok) {
        // Some backends use /folder or /folders — try fallback
        const fallback = await fetch(`${API}/folder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newFolderName.trim() }),
        });

        if (!fallback.ok) throw new Error(`HTTP ${fallback.status}`);
      }

      setFolderMsg("Folder created successfully!");
      showToast("Folder created!", "success");
      await fetchFiles(true);
      await fetchStorage();

      setTimeout(() => {
        setShowNewFolder(false);
        setNewFolderName("");
        setFolderMsg(null);
      }, 1500);
    } catch (err) {
      console.error("CREATE FOLDER ERROR:", err);
      setFolderMsg("Failed to create folder. Check API endpoint.");
      showToast("Failed to create folder.", "error");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[#020617]" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-250px] right-[-100px] w-[600px] h-[600px] bg-blue-500/10 blur-[160px] rounded-full" />

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

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-dataMove" />
        <div className="absolute top-[45%] right-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-dataMove2" />
        <div className="absolute top-[70%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-dataMove" />
      </div>

      <div className="absolute top-[20%] right-[10%] w-72 h-72 border border-cyan-500/10 rounded-full animate-pingSlow" />
      <div className="absolute top-[20%] right-[10%] w-96 h-96 border border-blue-500/10 rounded-full animate-pingSlow2" />

      {/* Toast notifications */}
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

      <div className="relative z-10 p-10">
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

        {/* Storage Info Card */}
        {storageInfo && (
          <div className="bg-[#071120]/70 border border-white/10 rounded-[28px] p-7 backdrop-blur-2xl mb-10">
            <div className="flex items-center gap-3 mb-5">
              <HardDrive size={22} className="text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Storage Usage</h2>
            </div>

            <div className="flex gap-8 mb-5">
              <div>
                <p className="text-slate-400 text-sm mb-1">Used</p>
                <p className="text-2xl font-black text-white">
                  {storageInfo?.used ?? "0 GB"}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">Free</p>
                <p className="text-2xl font-black text-green-400">
                  {storageInfo?.free ?? "0 GB"}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">Total</p>
                <p className="text-2xl font-black text-slate-300">
                  {storageInfo?.total ?? "0 GB"}
                </p>
              </div>
            </div>

            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                style={{ width: `${Number(storageInfo?.usedPercent ?? 0)}%` }}
              />
            </div>

            <p className="text-slate-500 text-sm mt-2">
              {storageInfo?.usedPercent ?? 0}% used
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-6 text-lg">
            {error}
          </div>
        )}

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

        {loading && (
          <p className="text-slate-400 text-lg mb-6 animate-pulse">
            Loading files…
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Folder size={64} className="mb-4 opacity-30" />
            <p className="text-xl font-semibold">No files found</p>
            <p className="text-sm mt-1">
              Upload a file or create a folder to get started.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((file, index) => {
            const color = getColor(file.name, file.type);
            const icon = getIcon(file.name, file.type);

            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-[#071120]/70 border border-white/10 rounded-[28px] p-7 backdrop-blur-2xl hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />

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
                    onClick={() => confirmDelete(file.name, file.type)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

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

                <h2 className="text-2xl font-bold mb-2 truncate pr-10">
                  {file.name}
                </h2>

                <div className="flex items-center gap-3">
                  <span
                    className="text-xs px-2 py-1 rounded-lg font-semibold uppercase tracking-wide"
                    style={{ background: `${color}20`, color }}
                  >
                    {file.type}
                  </span>
                  <p className="text-slate-400 text-lg">{file.size}</p>
                </div>

                <p className="text-slate-600 text-sm mt-1">
                  {formatDate(file.createdAt)}
                </p>

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

      {/* ── Custom Delete Confirmation Popup ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#071120] border border-white/10 rounded-[28px] p-8 w-full max-w-md shadow-[0_0_60px_rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Delete {deleteTarget.type === "folder" ? "Folder" : "File"}?
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 mb-6">
              <p className="text-slate-300 text-sm mb-1 uppercase tracking-widest text-xs font-semibold text-slate-500">
                {deleteTarget.type === "folder" ? "Folder" : "File"}
              </p>
              <p className="text-white font-bold text-lg truncate">
                {deleteTarget.name}
              </p>
            </div>

            <p className="text-slate-400 text-sm mb-7">
              Are you sure you want to move{" "}
              <span className="text-white font-semibold">
                "{deleteTarget.name}"
              </span>{" "}
              to the recycle bin?
            </p>

            <div className="flex gap-4">
              <button
                onClick={executeDelete}
                disabled={deleting}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>

              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 bg-white/10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Folder Popup ── */}
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
              <p
                className={`text-sm mb-4 ${
                  folderMsg.includes("successfully")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
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
