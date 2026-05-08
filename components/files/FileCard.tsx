"use client";

import { useState } from "react";

import {
  Folder,
  FileText,
  MoreVertical,
  Share2,
  Download,
  Copy,
  Trash2,
} from "lucide-react";

type FileCardProps = {
  name: string;
  type: "file" | "folder";
};

export default function FileCard({
  name,
  type,
}: FileCardProps) {

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative bg-[#111827] border border-slate-800 rounded-3xl p-6 hover:border-blue-500 transition-all duration-300">

      {/* Top */}
      <div className="flex items-start justify-between">

        {/* Icon */}
        <div>
          {type === "folder" ? (
            <Folder
              size={52}
              className="text-yellow-400"
            />
          ) : (
            <FileText
              size={52}
              className="text-blue-400"
            />
          )}
        </div>

        {/* Menu */}
        <div className="relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <MoreVertical size={24} />
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-14 w-52 bg-[#0b1120] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">

              {/* Share */}
              <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800 transition text-left">

                <Share2 size={18} />

                Share

              </button>

              {/* Download */}
              <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800 transition text-left">

                <Download size={18} />

                Download

              </button>

              {/* Copy */}
              <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-800 transition text-left">

                <Copy size={18} />

                Copy

              </button>

              {/* Delete */}
              <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-500/20 text-red-400 transition text-left">

                <Trash2 size={18} />

                Delete

              </button>

            </div>
          )}

        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10">

        <h2 className="text-2xl font-semibold">
          {name}
        </h2>

        <p className="text-slate-400 mt-2">
          {type === "folder"
            ? "Folder"
            : "Config File"}
        </p>

      </div>

    </div>
  );
}