import { NextRequest, NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await appendRow("Newsletter", [new Date().toISOString(), email]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit-newsletter error:", err);
    // TEMP: surface the real error for diagnosis — revert before shipping
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Failed to record submission", debug: message }, { status: 500 });
  }
}
