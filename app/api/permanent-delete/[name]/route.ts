import { NextResponse } from "next/server";

const BACKEND = "http://146.190.73.142:5000";

export async function DELETE(
  _req: Request,
  { params }: { params: { name: string } }
) {
  try {
    const name = decodeURIComponent(params.name);
    const res = await fetch(
      `${BACKEND}/permanent-delete/${encodeURIComponent(name)}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}