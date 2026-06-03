/**
 * SAHA Labs – VPS Cloud Storage API
 * server.js – Production-ready Express backend
 */

"use strict";

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const cron = require("node-cron");
const si = require("systeminformation");

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const PORT = 5000;

const STORAGE_ROOT = "/home/storage";

const UPLOADS_DIR = path.join(STORAGE_ROOT, "uploads");
const FOLDERS_DIR = path.join(STORAGE_ROOT, "folders");
const RECYCLE_DIR = path.join(STORAGE_ROOT, "recycle-bin");
const USERS_DIR = path.join(STORAGE_ROOT, "users");

const META_FILE = path.join(RECYCLE_DIR, ".meta.json");

const RECYCLE_TTL_DAYS = 30;

// ─────────────────────────────────────────────────────────────
// CREATE DIRECTORIES
// ─────────────────────────────────────────────────────────────

[UPLOADS_DIR, FOLDERS_DIR, RECYCLE_DIR, USERS_DIR].forEach((dir) => {
  fs.ensureDirSync(dir);
});

// ─────────────────────────────────────────────────────────────
// EXPRESS APP
// ─────────────────────────────────────────────────────────────

const app = express();

// ─────────────────────────────────────────────────────────────
// CORS FIX
// ─────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://vps-server-bb9v.vercel.app",
      "https://www.sahalabs.in",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function sanitiseName(raw) {
  if (!raw || typeof raw !== "string") return null;

  const name = path.basename(raw.trim());

  if (!name || name === "." || name === "..") return null;

  if (/[<>:"|?*\x00-\x1f]/.test(name)) return null;

  return name;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

async function readMeta() {
  try {
    if (await fs.pathExists(META_FILE)) {
      return await fs.readJson(META_FILE);
    }
  } catch {}

  return {};
}

async function writeMeta(meta) {
  await fs.writeJson(META_FILE, meta, { spaces: 2 });
}

function daysRemaining(deletedAt) {
  const deletedMs = new Date(deletedAt).getTime();

  const nowMs = Date.now();

  const elapsed = Math.floor((nowMs - deletedMs) / 86400000);

  return Math.max(0, RECYCLE_TTL_DAYS - elapsed);
}

// ─────────────────────────────────────────────────────────────
// MULTER
// ─────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },

  filename: (_req, file, cb) => {
    const safe =
      sanitiseName(file.originalname) || `upload-${Date.now()}`;

    const dest = path.join(UPLOADS_DIR, safe);

    const finalName = fs.existsSync(dest)
      ? `${Date.now()}-${safe}`
      : safe;

    cb(null, finalName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024 * 1024,
  },
});

// ─────────────────────────────────────────────────────────────
// STATUS
// ─────────────────────────────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({
    status: "SAHA Labs API Running",
  });
});

app.get("/status", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

// ─────────────────────────────────────────────────────────────
// STORAGE INFO
// ─────────────────────────────────────────────────────────────

app.get("/storage-info", async (_req, res) => {
  try {
    const disk = await si.fsSize();

    const relevant =
      disk.find((d) => STORAGE_ROOT.startsWith(d.mount)) ||
      disk.find((d) => d.mount === "/") ||
      disk[0];

    if (!relevant) {
      return res.status(500).json({
        error: "Could not read disk info",
      });
    }

    res.json({
      used: formatBytes(relevant.used),

      free: formatBytes(relevant.size - relevant.used),

      total: formatBytes(relevant.size),

      usedBytes: relevant.used,

      freeBytes: relevant.size - relevant.used,

      totalBytes: relevant.size,

      usedPercent: (
        (relevant.used / relevant.size) *
        100
      ).toFixed(1),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch storage info",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// FILE LIST
// ─────────────────────────────────────────────────────────────

app.get("/files", async (_req, res) => {
  try {
    const [uploadEntries, folderEntries] = await Promise.all([
      fs.readdir(UPLOADS_DIR),
      fs.readdir(FOLDERS_DIR),
    ]);

    const toItem = async (dir, name) => {
      const fullPath = path.join(dir, name);

      const stat = await fs.stat(fullPath);

      return {
        name,

        size: formatBytes(stat.size),

        createdAt: stat.birthtime.toISOString(),

        type: stat.isDirectory() ? "folder" : "file",
      };
    };

    const fileItems = await Promise.all(
      uploadEntries.map((n) => toItem(UPLOADS_DIR, n))
    );

    const folderItems = await Promise.all(
      folderEntries.map((n) => toItem(FOLDERS_DIR, n))
    );

    res.json([...folderItems, ...fileItems]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to list files",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// UPLOAD
// ─────────────────────────────────────────────────────────────

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file provided",
      });
    }

    res.json({
      message: "File uploaded successfully",

      filename: req.file.filename,

      size: formatBytes(req.file.size),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Upload failed",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// CREATE FOLDER
// ─────────────────────────────────────────────────────────────

app.post("/create-folder", async (req, res) => {
  try {
    const { name } = req.body;

    const safeName = sanitiseName(name);

    if (!safeName) {
      return res.status(400).json({
        error: "Invalid folder name",
      });
    }

    const folderPath = path.join(FOLDERS_DIR, safeName);

    if (await fs.pathExists(folderPath)) {
      return res.status(409).json({
        error: "Folder already exists",
      });
    }

    await fs.mkdir(folderPath);

    res.json({
      message: "Folder created",
      name: safeName,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create folder",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// DOWNLOAD
// ─────────────────────────────────────────────────────────────

app.get("/download/:filename", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.filename);

    if (!safeName) {
      return res.status(400).json({
        error: "Invalid filename",
      });
    }

    const filePath = path.join(UPLOADS_DIR, safeName);

    if (!(await fs.pathExists(filePath))) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    res.download(filePath, safeName);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Download failed",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE FILE → RECYCLE BIN
// ─────────────────────────────────────────────────────────────

async function moveToRecycleBin(filename) {
  const srcPath = path.join(UPLOADS_DIR, filename);

  if (!(await fs.pathExists(srcPath))) {
    throw new Error("File not found");
  }

  const destPath = path.join(RECYCLE_DIR, filename);

  await fs.move(srcPath, destPath, {
    overwrite: true,
  });

  const meta = await readMeta();

  meta[filename] = {
    deletedAt: new Date().toISOString(),

    originalLocation: UPLOADS_DIR,

    type: "file",
  };

  await writeMeta(meta);
}

app.delete("/files/:filename", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.filename);

    if (!safeName) {
      return res.status(400).json({
        error: "Invalid filename",
      });
    }

    await moveToRecycleBin(safeName);

    res.json({
      message: `"${safeName}" moved to recycle bin`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Delete failed",
    });
  }
});

// OLD ROUTE SUPPORT

app.delete("/delete/:filename", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.filename);

    if (!safeName) {
      return res.status(400).json({
        error: "Invalid filename",
      });
    }

    await moveToRecycleBin(safeName);

    res.json({
      message: `"${safeName}" moved to recycle bin`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Delete failed",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// RECYCLE BIN
// ─────────────────────────────────────────────────────────────

app.get("/recycle-bin", async (_req, res) => {
  try {
    const meta = await readMeta();

    const entries = await fs.readdir(RECYCLE_DIR);

    const items = await Promise.all(
      entries
        .filter((n) => n !== ".meta.json")
        .map(async (name) => {
          const fullPath = path.join(RECYCLE_DIR, name);

          const stat = await fs.stat(fullPath);

          const m = meta[name] || {};

          const deletedAt =
            m.deletedAt || stat.mtime.toISOString();

          return {
            name,

            size: formatBytes(stat.size),

            deletedAt,

            daysRemaining: daysRemaining(deletedAt),

            type:
              m.type ||
              (stat.isDirectory() ? "folder" : "file"),
          };
        })
    );

    res.json(items);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to list recycle bin",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// RESTORE
// ─────────────────────────────────────────────────────────────

app.post("/restore/:name", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.name);

    if (!safeName) {
      return res.status(400).json({
        error: "Invalid name",
      });
    }

    const srcPath = path.join(RECYCLE_DIR, safeName);

    const meta = await readMeta();

    const m = meta[safeName] || {};

    const dest = path.join(
      m.originalLocation || UPLOADS_DIR,
      safeName
    );

    await fs.move(srcPath, dest, {
      overwrite: true,
    });

    delete meta[safeName];

    await writeMeta(meta);

    res.json({
      message: `"${safeName}" restored`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Restore failed",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// PERMANENT DELETE
// ─────────────────────────────────────────────────────────────

app.delete("/permanent-delete/:name", async (req, res) => {
  try {
    const safeName = sanitiseName(req.params.name);

    const targetPath = path.join(RECYCLE_DIR, safeName);

    await fs.remove(targetPath);

    const meta = await readMeta();

    delete meta[safeName];

    await writeMeta(meta);

    res.json({
      message: `"${safeName}" permanently deleted`,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Permanent delete failed",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// EMPTY BIN
// ─────────────────────────────────────────────────────────────

app.delete("/empty-bin", async (_req, res) => {
  try {
    const entries = await fs.readdir(RECYCLE_DIR);

    await Promise.all(
      entries
        .filter((n) => n !== ".meta.json")
        .map((n) =>
          fs.remove(path.join(RECYCLE_DIR, n))
        )
    );

    await writeMeta({});

    res.json({
      message: "Recycle bin emptied",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to empty bin",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// AUTO DELETE CRON
// ─────────────────────────────────────────────────────────────

cron.schedule("0 0 * * *", async () => {
  try {
    const meta = await readMeta();

    const entries = await fs.readdir(RECYCLE_DIR);

    const now = Date.now();

    for (const name of entries) {
      if (name === ".meta.json") continue;

      const m = meta[name];

      const deletedAt = m?.deletedAt
        ? new Date(m.deletedAt).getTime()
        : (
            await fs.stat(path.join(RECYCLE_DIR, name))
          ).mtime.getTime();

      const ageDays = (now - deletedAt) / 86400000;

      if (ageDays >= RECYCLE_TTL_DAYS) {
        await fs.remove(path.join(RECYCLE_DIR, name));

        delete meta[name];
      }
    }

    await writeMeta(meta);
  } catch (err) {
    console.error(err);
  }
});

// ─────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`SAHA Labs API running on port ${PORT}`);
});