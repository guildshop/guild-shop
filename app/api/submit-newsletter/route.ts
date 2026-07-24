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
    const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "";
    const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL ?? "";
    return NextResponse.json(
      {
        error: "Failed to record submission",
        debug: message,
        debugIdLen: id.length,
        debugIdFirstLast: id ? `${id.slice(0, 6)}...${id.slice(-6)}` : "(empty)",
        debugIdHasWhitespace: /\s/.test(id),
        debugEmail: email,
      },
      { status: 500 }
    );
  }
}
