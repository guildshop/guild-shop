import { NextRequest, NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

// Note: we deliberately do NOT store the password — only the email and
// which mode (login vs signup) was used, plus a timestamp.
export async function POST(req: NextRequest) {
  try {
    const { email, mode } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await appendRow("Login", [new Date().toISOString(), email, mode ?? ""]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit-login error:", err);
    return NextResponse.json({ error: "Failed to record submission" }, { status: 500 });
  }
}
