"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Trash2,
  RotateCcw,
  FileText,
  Image,
  Video,
  Archive,
  AlertTriangle,
  Folder,
  Music,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";

interface RecycleItem {
  name: string;
  size: string;
  deletedAt: string;
  daysRemaining?: number;
  type: "file" | "folder";
  originalLocation: string;
}

interface Toast {
  id: number;
  message: string;
  kind: "success" | "error";
}

type ModalAction =
  | { kind: "restore"; item: RecycleItem }
  | { kind: "delete"; name: string }
  | { kind: "empty" };

const API = "/api";

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

interface ConfirmModalProps {
  action: ModalAction;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function ConfirmModal({
  action,
  onConfirm,
  onCancel,
  loading,
}: ConfirmModalProps) {
  const isDelete = action.kind === "delete" || action.kind === "empty";
  const isRestore = action.kind === "restore";

  const title =
    action.kind === "empty"
      ? "Empty Recycle Bin"
      : action.kind === "delete"
        ? "Permanently Delete"
        : "Restore File";

  const description =
    action.kind === "empty"
      ? "All items will be permanently deleted. This action cannot be undone."
      : action.kind === "delete"
        ? `"${action.name}" will be permanently deleted and cannot be recovered.`
        : `"${action.item.name}" will be restored to its original location.`;

  const accentColor = isRestore ? "#34d399" : "#f87171";
  const btnLabel = isRestore ? "Restore" : isDelete ? "Delete" : "Confirm";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div
        className="relative z-10 w-full max-w-md mx-4 rounded-[28px] border border-white/10 bg-[#071120]/95 backdrop-blur-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
        style={{
          boxShadow: `0 0 60px ${accentColor}20, 0 0 120px rgba(0,0,0,0.8)`,
        }}
      >
        <div
          className="absolute top-0 left-8 right-8 h-[2px] rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
          }}
        />

        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
            color: accentColor,
          }}
        >
          {isRestore ? <RotateCcw size={28} /> : <ShieldAlert size={28} />}
        </div>

        <h2 className="text-2xl font-black text-white mb-2">{title}</h2>

        <p className="text-slate-400 text-base mb-8 leading-relaxed">
          {description}
        </p>

        {action.kind !== "empty" && (
          <div
            className="rounded-xl px-4 py-3 mb-8 flex items-center gap-3"
            style={{
              background: `${accentColor}10`,
              border: `1px solid ${accentColor}20`,
            }}
          >
            <div style={{ color: accentColor }}>
              {isRestore ? <Check size={16} /> : <Trash2 size={16} />}
            </div>

            <span
              className="text-sm font-medium"
              style={{ color: accentColor }}
            >
              {action.kind === "restore"
                ? `Destination: ${
                    action.item.originalLocation || "Original location"
                  }`
                : "This cannot be undone"}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-5 py-3 rounded-xl border border-white/10 text-slate-300 font-semibold hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-5 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)`,
              color: "#fff",
              boxShadow: `0 0 25px ${accentColor}40`,
            }}
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                {isRestore ? <RotateCcw size={16} /> : <Trash2 size={16} />}
                {btnLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecycleBinPage() {
  const [items, setItems] = useState<RecycleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalAction | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const toastIdRef = useRef(0);

  const showToast = useCallback(
    (message: string, kind: "success" | "error") => {
      const id = ++toastIdRef.current;
      setToasts((prev) => [...prev, { id, message, kind }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    [],
  );

  const fetchItems = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await fetch(`${API}/recycle-bin`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: RecycleItem[] = await res.json();
      setItems(data);
      setError(null);
    } catch (err) {
      console.error("Recycle bin fetch error:", err);
      setError("Could not load recycle bin. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();

    const interval = setInterval(() => {
      fetchItems(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchItems]);

  const handleModalConfirm = async () => {
    if (!modal) return;

    setModalLoading(true);

    try {
      let res: Response;

      if (modal.kind === "restore") {
        const item = modal.item;

        const endpoint =
          item.type === "folder"
            ? `${API}/restore-folder/${encodeURIComponent(item.name)}`
            : `${API}/restore/${encodeURIComponent(item.name)}`;

        res = await fetch(endpoint, {
          method: "POST",
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Restore error:", res.status, text);
          throw new Error(text);
        }

        showToast(`"${item.name}" restored successfully.`, "success");
      }

      if (modal.kind === "delete") {
        res = await fetch(
          `${API}/permanent-delete/${encodeURIComponent(modal.name)}`,
          {
            method: "DELETE",
          },
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Delete error:", res.status, text);
          throw new Error(text);
        }

        showToast(`"${modal.name}" permanently deleted.`, "success");
      }

      if (modal.kind === "empty") {
        res = await fetch(`${API}/empty-bin`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Empty bin error:", res.status, text);
          throw new Error(text);
        }

        showToast("Recycle bin emptied.", "success");
      }

      await fetchItems(true);
      setModal(null);
    } catch (err) {
      console.error("Action failed:", err);

      const msg =
        modal.kind === "restore"
          ? "Restore failed. Check backend API."
          : modal.kind === "empty"
            ? "Failed to empty bin. Check backend API."
            : "Permanent delete failed. Check backend API.";

      showToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[#020617] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] bg-red-500/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-250px] right-[-100px] w-[700px] h-[700px] bg-orange-500/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-trashFloat opacity-10"
            style={{
              top: `${(i * 41 + 9) % 100}%`,
              left: `${(i * 57 + 13) % 100}%`,
              animationDuration: `${10 + (i % 5) * 2}s`,
              animationDelay: `${(i % 5) * 1}s`,
            }}
          >
            <Trash2 size={40 + (i % 3) * 20} color="rgba(255,255,255,0.3)" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent animate-deleteMove" />
        <div className="absolute top-[50%] right-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent animate-deleteMove2" />
        <div className="absolute top-[75%] left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-transparent via-red-400/40 to-transparent animate-deleteMove" />
      </div>

      <div className="absolute top-[20%] right-[15%] w-72 h-72 border border-red-500/10 rounded-full animate-dangerPulse pointer-events-none" />
      <div className="absolute top-[20%] right-[15%] w-96 h-96 border border-orange-500/10 rounded-full animate-dangerPulse2 pointer-events-none" />

      <div className="absolute top-[10%] left-[45%] animate-warning pointer-events-none">
        <AlertTriangle size={90} color="rgba(239,68,68,0.15)" />
      </div>

      {modal && (
        <ConfirmModal
          action={modal}
          onConfirm={handleModalConfirm}
          onCancel={() => !modalLoading && setModal(null)}
          loading={modalLoading}
        />
      )}

      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border text-base font-semibold shadow-2xl backdrop-blur-xl pointer-events-auto transition-all ${
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
            <h1 className="text-5xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              RECYCLE BIN
            </h1>

            <p className="text-slate-400 mt-3 text-lg">
              Deleted files waiting for recovery · Auto-deleted after 30 days
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModal({ kind: "empty" })}
            disabled={items.length === 0}
            className="relative z-20 flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-[0_0_35px_rgba(239,68,68,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={22} />
            Empty Bin
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 mb-6 text-lg">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-slate-400 text-lg mb-6 animate-pulse">
            Loading recycle bin...
          </p>
        )}

        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Trash2 size={64} className="mb-4 opacity-30" />
            <p className="text-xl font-semibold">Recycle bin is empty</p>
            <p className="text-sm mt-1">Deleted files will appear here.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          {items.map((item, index) => {
            const color = getColor(item.name, item.type);
            const icon = getIcon(item.name, item.type);

            return (
              <div
                key={`${item.name}-${index}`}
                className="group relative overflow-hidden bg-[#071120]/70 border border-white/10 rounded-[28px] p-7 backdrop-blur-2xl hover:border-red-400/40 transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 pointer-events-none" />

                <div className="relative z-10">
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

                  <h2 className="text-2xl font-bold mb-2 truncate">
                    {item.name}
                  </h2>

                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded-lg font-semibold uppercase tracking-wide"
                      style={{ background: `${color}20`, color }}
                    >
                      {item.type}
                    </span>

                    <p className="text-slate-400 text-lg">{item.size}</p>
                  </div>

                  <p className="text-slate-500 text-sm mb-6">
                    Deleted: {formatDate(item.deletedAt)}
                  </p>

                  <div className="flex gap-4 relative z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModal({ kind: "restore", item });
                      }}
                      className="relative z-20 flex items-center gap-2 bg-green-500/15 border border-green-400/20 px-5 py-3 rounded-xl hover:bg-green-500/25 transition-all font-semibold text-green-300"
                    >
                      <RotateCcw size={18} />
                      Restore
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModal({ kind: "delete", name: item.name });
                      }}
                      className="relative z-20 flex items-center gap-2 bg-red-500/15 border border-red-400/20 px-5 py-3 rounded-xl hover:bg-red-500/25 transition-all font-semibold text-red-300"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-0 h-[3px] w-full pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, ${color}, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

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
          0%,
          100% {
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
