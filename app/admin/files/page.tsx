"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  FolderPlus,
  Trash2,
  Download,
  Folder,
  FileText,
} from "lucide-react";

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
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [folderName, setFolderName] = useState("");

  const [showFolderModal, setShowFolderModal] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // ================= TOAST =================

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ================= FETCH FILES =================

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API}/files`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await res.json();

      setFiles(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load files", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= STORAGE =================

  const fetchStorage = async () => {
    try {
      const res = await fetch(`${API}/storage-info`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();

      setStorageInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchFiles();
    fetchStorage();

    const interval = setInterval(() => {
      fetchFiles();
      fetchStorage();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= UPLOAD =================

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      showToast("File uploaded successfully", "success");

      fetchFiles();
      fetchStorage();
    } catch (err) {
      console.error(err);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (name: string, type: string) => {
    try {
      const endpoint =
        type === "folder"
          ? `${API}/folder/${encodeURIComponent(name)}`
          : `${API}/files/${encodeURIComponent(name)}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      showToast(`"${name}" moved to recycle bin`, "success");

      fetchFiles();
      fetchStorage();
    } catch (err) {
      console.error(err);

      showToast("Delete failed. Please try again.", "error");
    }
  };

  // ================= DOWNLOAD =================

  const handleDownload = (name: string) => {
    window.open(`${API}/download/${encodeURIComponent(name)}`, "_blank");
  };

  // ================= CREATE FOLDER =================

  const createFolder = async () => {
    if (!folderName.trim()) return;

    try {
      const res = await fetch(`${API}/create-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
        }),
      });

      if (!res.ok) {
        throw new Error("Folder create failed");
      }

      showToast("Folder created", "success");

      setFolderName("");

      setShowFolderModal(false);

      fetchFiles();
    } catch (err) {
      console.error(err);

      showToast("Failed to create folder", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-10 relative overflow-hidden">
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          className="w-full h-full"
        />
      </div>

      {/* ================= TOAST ================= */}

      {toast && (
        <div
          className={`fixed top-7 right-7 z-50 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-12 relative z-10">
        <div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            FILE STORAGE
          </h1>

          <p className="text-slate-400 mt-3 text-xl">
            Manage your VPS files and folders
          </p>
        </div>

        <div className="flex gap-5">
          {/* Upload */}
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleUpload} />

            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition-all px-7 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-xl">
              <Upload size={22} />

              {uploading ? "Uploading..." : "Upload File"}
            </div>
          </label>

          {/* Folder */}
          <button
            onClick={() => setShowFolderModal(true)}
            className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:scale-105 transition-all px-7 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-xl"
          >
            <FolderPlus size={22} />
            New Folder
          </button>
        </div>
      </div>

      {/* ================= STORAGE ================= */}

      {storageInfo && (
        <div className="bg-[#071120]/80 border border-white/10 rounded-[32px] p-8 mb-10 backdrop-blur-2xl relative z-10">
          <h2 className="text-3xl font-bold mb-7">Storage Usage</h2>

          <div className="grid grid-cols-3 gap-8 mb-7">
            <div>
              <p className="text-slate-400 mb-2">Used</p>

              <div className="text-5xl font-black text-white">
                {storageInfo.used}
              </div>
            </div>

            <div>
              <p className="text-slate-400 mb-2">Free</p>

              <div className="text-5xl font-black text-green-400">
                {storageInfo.free}
              </div>
            </div>

            <div>
              <p className="text-slate-400 mb-2">Total</p>

              <div className="text-5xl font-black text-slate-300">
                {storageInfo.total}
              </div>
            </div>
          </div>

          <div className="w-full h-5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700"
              style={{
                width: `${storageInfo.usedPercent}%`,
              }}
            />
          </div>

          <p className="text-slate-400 mt-3">{storageInfo.usedPercent}% used</p>
        </div>
      )}

      {/* ================= FILES ================= */}

      {loading ? (
        <div className="text-cyan-400 text-xl animate-pulse">
          Loading files...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
          {files.map((file) => (
            <div
              key={file.name}
              className="bg-[#071120]/80 border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl hover:border-cyan-400/30 transition-all"
            >
              {/* Icon */}
              <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-7">
                {file.type === "folder" ? (
                  <Folder size={48} className="text-cyan-400" />
                ) : (
                  <FileText size={48} className="text-blue-400" />
                )}
              </div>

              {/* Name */}
              <h2 className="text-3xl font-bold mb-3 break-words">
                {file.name}
              </h2>

              {/* Size */}
              <div className="text-slate-400 text-lg mb-2">{file.size}</div>

              {/* Date */}
              <div className="text-slate-500 text-sm mb-8">
                {new Date(file.createdAt).toLocaleString()}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                {file.type === "file" && (
                  <button
                    onClick={() => handleDownload(file.name)}
                    className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Download size={18} />
                    Download
                  </button>
                )}

                <button
                  onClick={() => handleDelete(file.name, file.type)}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-all text-red-400"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading && files.length === 0 && (
        <div className="text-center mt-32 text-slate-400 text-2xl">
          No files found
        </div>
      )}

      {/* ================= MODAL ================= */}

      {showFolderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#071120] border border-white/10 rounded-[32px] p-10 w-[450px]">
            <h2 className="text-3xl font-bold mb-7">Create Folder</h2>

            <input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full bg-[#0b1728] border border-white/10 rounded-2xl px-5 py-4 outline-none text-lg mb-7"
            />

            <div className="flex gap-5">
              <button
                onClick={() => setShowFolderModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>

              <button
                onClick={createFolder}
                className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 py-4 rounded-2xl font-bold hover:scale-105 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
