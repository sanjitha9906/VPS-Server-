"use client";

import { useState } from "react";

export default function FileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="text-4xl text-white"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden z-50">

          <button
            onClick={() => alert("Share clicked")}
            className="w-full text-left px-6 py-4 hover:bg-zinc-800 transition"
          >
            Share
          </button>

          <button
            onClick={() => alert("Download started")}
            className="w-full text-left px-6 py-4 hover:bg-zinc-800 transition"
          >
            Download
          </button>

          <button
            onClick={() => alert("Copied")}
            className="w-full text-left px-6 py-4 hover:bg-zinc-800 transition"
          >
            Copy
          </button>

          <button
            onClick={() => alert("Deleted")}
            className="w-full text-left px-6 py-4 hover:bg-zinc-800 transition text-red-400"
          >
            Delete
          </button>

        </div>
      )}

    </div>
  );
}