import { NextRequest, NextResponse } from "next/server";

const BACKEND = "http://146.190.73.142:5000";

// DELETE /api/folder/[foldername]  →  DELETE backend /folder/:foldername
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { foldername: string } }
) {
  try {
    const name = encodeURIComponent(params.foldername);
    const res  = await fetch(`${BACKEND}/folder/${name}`, { method: "DELETE" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}