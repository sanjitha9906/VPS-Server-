import { NextRequest, NextResponse } from "next/server";

const BACKEND = "http://146.190.73.142:5000";

// DELETE /api/files/[filename]  →  DELETE backend /files/:filename
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = encodeURIComponent(params.filename);
    const res = await fetch(`${BACKEND}/files/${filename}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}