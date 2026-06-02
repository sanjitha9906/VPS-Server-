import { NextResponse } from "next/server";

const BACKEND = "http://146.190.73.142:5000";

export async function GET() {
  try {
    const res  = await fetch(`${BACKEND}/storage-info`, { cache: "no-store" });
    const data = await res.json();

    // Normalise whichever field-name shape the backend returns
    const used  = data.used        ?? data.usedStorage   ?? "0 GB";
    const free  = data.free        ?? data.freeStorage   ?? "0 GB";
    const total = data.total       ?? data.totalStorage  ?? "0 GB";

    // Calculate usedPercent if the backend didn't send it
    let usedPercent = data.usedPercent ?? "0";
    if (!data.usedPercent && data.usedBytes && data.totalBytes) {
      usedPercent = ((data.usedBytes / data.totalBytes) * 100).toFixed(1);
    } else if (!data.usedPercent) {
      // Parse GB strings as fallback
      const usedGB  = parseFloat(String(used));
      const totalGB = parseFloat(String(total));
      if (totalGB > 0) {
        usedPercent = ((usedGB / totalGB) * 100).toFixed(1);
      }
    }

    return NextResponse.json({
      used,
      free,
      total,
      usedPercent,
      usedBytes:  data.usedBytes  ?? 0,
      freeBytes:  data.freeBytes  ?? 0,
      totalBytes: data.totalBytes ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}