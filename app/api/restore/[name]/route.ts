import { NextResponse } from "next/server";

const BACKEND = "http://146.190.73.142:5000";

export async function POST(
  _req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const name = decodeURIComponent(params.name);
    const res = await fetch(`${BACKEND}/restore/${encodeURIComponent(name)}`, {
      method: "POST",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}