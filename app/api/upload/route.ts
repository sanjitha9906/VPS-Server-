import { NextRequest, NextResponse } from "next/server";

const BACKEND = "http://146.190.73.142:5000";

export async function POST(req: NextRequest) {
  try {
    // Pass the FormData straight through to the backend.
    const formData = await req.formData();

    const res = await fetch(`${BACKEND}/upload`, {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type — fetch sets it automatically with the correct boundary.
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

// Next.js App Router disables body parsing for routes that handle their own
// streaming / FormData; no extra config needed here.