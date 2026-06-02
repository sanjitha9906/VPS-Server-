import { NextResponse } from "next/server";

const BACKEND = "http://146.190.73.142:5000";

export async function GET() {
  try {
    const res  = await fetch(`${BACKEND}/recycle-bin`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}