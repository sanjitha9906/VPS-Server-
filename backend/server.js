/**
 * SAHA Labs – VPS Cloud Storage API
 * server.js – Production-ready Express backend
 *
 * Install: npm install express cors multer fs-extra node-cron systeminformation
 * Run:     pm2 start server.js --name sahalabs-api
 */

"use strict";

const express        = require("express");
const cors           = require("cors");
const multer         = require("multer");
const fs             = require("fs-extra");
const path           = require("path");
const cron           = require("node-cron");
const si             = require("systeminformation");

// ─── Constants ────────────────────────────────────────────────────────────────

const PORT            = 5000;
const STORAGE_ROOT    = "/home/storage";
const UPLOADS_DIR     = path.join(STORAGE_ROOT, "uploads");
const FOLDERS_DIR     = path.join(STORAGE_ROOT, "folders");
const RECYCLE_DIR     = path.join(STORAGE_ROOT, "recycle-bin");
const USERS_DIR       = path.join(STORAGE_ROOT, "users");
const META_FILE       = path.join(RECYCLE_DIR, ".meta.json");
const RECYCLE_TTL_DAYS = 30;

// ─── Initialise directories ───────────────────────────────────────────────────

[UPLOADS_DIR, FOLDERS_DIR, RECYCLE_DIR, USERS_DIR].forEach((dir) =>
  fs.ensureDirSync(dir)
);

// ─── App ──────────────────────────────────────────────────────────────────────

const app = express();

app.use(cors());
app.use(express.json());

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sanitise a filename/foldername to prevent path traversal.
 * Returns null if the name is unsafe.
 */
function sanitiseName(raw) {
  if (!raw || typeof raw !== "string") return null;
  const name = path.basename(raw.trim());          // strips any directory component
  if (!name || name === "." || name === "..") return null;
  if (/[<>:"|?*\x00-\x1f]/.test(name)) return null; // Windows-unsafe chars too
  return name;
}

/**
 * Human-readable byte string.
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Read the recycle-bin metadata map (name → meta).
 */
async function readMeta() {
  try {
    if (await fs.pathExists(META_FILE)) {
      return await fs.readJson(META_FILE);
    }
  } catch { /* ignore */ }
  return {};
}

/**
 * Write the recycle-bin metadata map.
 */
async function writeMeta(meta) {
  await fs.writeJson(META_FILE, meta, { spaces: 2 });
}

/**
 * Days remaining until permanent auto-delete (max 30).
 */
function daysRemaining(deletedAt) {
  const deletedMs = new Date(deletedAt).getTime();
  const nowMs     = Date.now();
  const elapsed   = Math.floor((nowMs - deletedMs) / 86_400_000);
  return Math.max(0, RECYCLE_TTL_DAYS - elapsed);
}

// ─── Multer (file upload) ─────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename:    (_req, file, cb) => {
    const safe = sanitiseName(file.originalname) ?? `upload-${Date.now()}`;
    // Avoid clobbering: prefix with timestamp if file exists
    const dest = path.join(UPLOADS_DIR, safe);
    const final = fs.existsSync(dest)
      ? `${Date.now()}-${safe}`
      : safe;
    cb(null, final);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10 GB
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /status
app.get("/status", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// GET /storage-info
app.get("/storage-info", async (_req, res) => {
  try {
    const disk = await si.fsSize();
    // Find the filesystem that contains our storage root
    const relevant = disk.find((d) => STORAGE_ROOT.startsWith(d.mount))
      ?? disk.find((d) => d.mount === "/")
      ?? disk[0];

    if (!relevant) {
      return res.status(500).json({ error: "Could not read disk info" });
    }

    res.json({
      used:  formatBytes(relevant.used),
      free:  formatBytes(relevant.size - relevant.used),
      total: formatBytes(relevant.size),
      usedBytes:  relevant.used,
      freeBytes:  relevant.size - relevant.used,
      totalBytes: relevant.size,
      usedPercent: ((relevant.used / relevant.size) * 100).toFixed(1),
    });
  } catch (err) {
    console.error("storage-info error:", err);
    res.status(500).json({ error: "Failed to fetch storage info" });
  }
});

// ─── Files ────────────────────────────────────────────────────────────────────

// GET /files — list uploads + folders
app.get("/files", async (_req, res) => {
  try {
    const [uploadEntries, folderEntries] = await Promise.all([
      fs.readdir(UPLOADS_DIR),
      fs.readdir(FOLDERS_DIR),
    ]);

    const toItem = async (dir, name) => {
      const fullPath = path.join(dir, name);
      const stat     = await fs.stat(fullPath);
      return {
        name,
        size:      formatBytes(stat.size),
        createdAt: stat.birthtime.toISOString(),
        type:      stat.isDirectory() ? "folder" : "file",
      };
    };

    const fileItems   = await Promise.all(uploadEntries.map((n) => toItem(UPLOADS_DIR, n)));
    const folderItems = await Promise.all(folderEntries.map((n) => toItem(FOLDERS_DIR, n)));

    // Unified list – folders first, then files
    const items = [...folderItems, ...fileItems];
    res.json(items);
  } catch (err) {
    console.error("GET /files error:", err);
    res.status(500).json({ error: "Failed to list files" });
  }
});

// POST /upload
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    res.json({
      message:  "File uploaded successfully",
      filename: req.file.filename,
      size:     formatBytes(req.file.size),
    });
  } catch (err) {
    console.error("POST /upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// POST /create-folder
app.post("/create-folder", async (req, res) => {
  try {
    const { name } = req.body ?? {};
    const safeName = sanitiseName(name);
    if (!safeName) {
      return res.status(400).json({ error: "Invalid folder name" });
    }

    const folderPath = path.join(FOLDERS_DIR, safeName);
    if (await fs.pathExists(folderPath)) {
      return res.status(409).json({ error: "Folder already exists" });
    }

    await fs.mkdir(folderPath);
    res.json({ message: "Folder created", name: safeName });
  } catch (err) {
    console.error("POST /create-folder error:", err);
    res.status(500).json({ error: "Failed to create folder" });
  }
});

// GET /download/:filename
app.get("/download/:filename", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.filename);
    if (!safeName) return res.status(400).json({ error: "Invalid filename" });

    const filePath = path.join(UPLOADS_DIR, safeName);
    if (!(await fs.pathExists(filePath))) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, safeName);
  } catch (err) {
    console.error("GET /download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});

// DELETE /files/:filename — soft delete (move to recycle bin)
app.delete("/files/:filename", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.filename);
    if (!safeName) return res.status(400).json({ error: "Invalid filename" });

    const srcPath  = path.join(UPLOADS_DIR, safeName);
    if (!(await fs.pathExists(srcPath))) {
      return res.status(404).json({ error: "File not found" });
    }

    const destPath = path.join(RECYCLE_DIR, safeName);
    await fs.move(srcPath, destPath, { overwrite: true });

    // Write metadata
    const meta = await readMeta();
    meta[safeName] = {
      deletedAt:        new Date().toISOString(),
      originalLocation: UPLOADS_DIR,
      type:             "file",
    };
    await writeMeta(meta);

    res.json({ message: `"${safeName}" moved to recycle bin` });
  } catch (err) {
    console.error("DELETE /files error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// DELETE /folder/:foldername — soft delete folder
app.delete("/folder/:foldername", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.foldername);
    if (!safeName) return res.status(400).json({ error: "Invalid folder name" });

    const srcPath = path.join(FOLDERS_DIR, safeName);
    if (!(await fs.pathExists(srcPath))) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const destPath = path.join(RECYCLE_DIR, safeName);
    await fs.move(srcPath, destPath, { overwrite: true });

    const meta = await readMeta();
    meta[safeName] = {
      deletedAt:        new Date().toISOString(),
      originalLocation: FOLDERS_DIR,
      type:             "folder",
    };
    await writeMeta(meta);

    res.json({ message: `Folder "${safeName}" moved to recycle bin` });
  } catch (err) {
    console.error("DELETE /folder error:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// ─── Recycle Bin ──────────────────────────────────────────────────────────────

// GET /recycle-bin
app.get("/recycle-bin", async (_req, res) => {
  try {
    const meta    = await readMeta();
    const entries = await fs.readdir(RECYCLE_DIR);

    const items = await Promise.all(
      entries
        .filter((n) => n !== ".meta.json")
        .map(async (name) => {
          const fullPath   = path.join(RECYCLE_DIR, name);
          const stat       = await fs.stat(fullPath);
          const m          = meta[name] ?? {};
          const deletedAt  = m.deletedAt ?? stat.mtime.toISOString();
          return {
            name,
            size:             formatBytes(stat.size),
            deletedAt,
            daysRemaining:    daysRemaining(deletedAt),
            type:             m.type ?? (stat.isDirectory() ? "folder" : "file"),
            originalLocation: m.originalLocation ?? UPLOADS_DIR,
          };
        })
    );

    res.json(items);
  } catch (err) {
    console.error("GET /recycle-bin error:", err);
    res.status(500).json({ error: "Failed to list recycle bin" });
  }
});

// POST /restore/:name — restore file back to uploads
app.post("/restore/:name", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.name);
    if (!safeName) return res.status(400).json({ error: "Invalid name" });

    const srcPath = path.join(RECYCLE_DIR, safeName);
    if (!(await fs.pathExists(srcPath))) {
      return res.status(404).json({ error: "Item not found in recycle bin" });
    }

    const meta = await readMeta();
    const m    = meta[safeName] ?? {};
    const dest = path.join(m.originalLocation ?? UPLOADS_DIR, safeName);

    await fs.move(srcPath, dest, { overwrite: true });

    delete meta[safeName];
    await writeMeta(meta);

    res.json({ message: `"${safeName}" restored` });
  } catch (err) {
    console.error("POST /restore error:", err);
    res.status(500).json({ error: "Restore failed" });
  }
});

// POST /restore-folder/:name — restore folder back to folders dir
app.post("/restore-folder/:name", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.name);
    if (!safeName) return res.status(400).json({ error: "Invalid name" });

    const srcPath = path.join(RECYCLE_DIR, safeName);
    if (!(await fs.pathExists(srcPath))) {
      return res.status(404).json({ error: "Folder not found in recycle bin" });
    }

    const meta = await readMeta();
    const m    = meta[safeName] ?? {};
    const dest = path.join(m.originalLocation ?? FOLDERS_DIR, safeName);

    await fs.move(srcPath, dest, { overwrite: true });

    delete meta[safeName];
    await writeMeta(meta);

    res.json({ message: `Folder "${safeName}" restored` });
  } catch (err) {
    console.error("POST /restore-folder error:", err);
    res.status(500).json({ error: "Restore failed" });
  }
});

// DELETE /permanent-delete/:name
app.delete("/permanent-delete/:name", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.name);
    if (!safeName) return res.status(400).json({ error: "Invalid name" });

    const targetPath = path.join(RECYCLE_DIR, safeName);
    if (!(await fs.pathExists(targetPath))) {
      return res.status(404).json({ error: "Item not found in recycle bin" });
    }

    await fs.remove(targetPath);

    const meta = await readMeta();
    delete meta[safeName];
    await writeMeta(meta);

    res.json({ message: `"${safeName}" permanently deleted` });
  } catch (err) {
    console.error("DELETE /permanent-delete error:", err);
    res.status(500).json({ error: "Permanent delete failed" });
  }
});

// DELETE /empty-bin
app.delete("/empty-bin", async (_req, res) => {
  try {
    const entries = await fs.readdir(RECYCLE_DIR);
    await Promise.all(
      entries
        .filter((n) => n !== ".meta.json")
        .map((n) => fs.remove(path.join(RECYCLE_DIR, n)))
    );
    await writeMeta({});
    res.json({ message: "Recycle bin emptied" });
  } catch (err) {
    console.error("DELETE /empty-bin error:", err);
    res.status(500).json({ error: "Failed to empty bin" });
  }
});

// ─── Auto-delete cron (every midnight) ───────────────────────────────────────

cron.schedule("0 0 * * *", async () => {
  console.log("[cron] Running recycle-bin auto-delete…");
  try {
    const meta    = await readMeta();
    const entries = await fs.readdir(RECYCLE_DIR);
    const now     = Date.now();

    for (const name of entries) {
      if (name === ".meta.json") continue;
      const m         = meta[name];
      const deletedAt = m?.deletedAt
        ? new Date(m.deletedAt).getTime()
        : (await fs.stat(path.join(RECYCLE_DIR, name))).mtime.getTime();

      const agedays = (now - deletedAt) / 86_400_000;
      if (agedays >= RECYCLE_TTL_DAYS) {
        await fs.remove(path.join(RECYCLE_DIR, name));
        delete meta[name];
        console.log(`[cron] Permanently deleted: ${name}`);
      }
    }
    await writeMeta(meta);
  } catch (err) {
    console.error("[cron] Auto-delete error:", err);
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`SAHA Labs API running on port ${PORT}`);
});