import { NextRequest, NextResponse } from "next/server";
import { appendRow } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name = "", brandName = "", location = "", founded = "", category = "",
      description = "", portfolioUrl = "", instagramUrl = "", vision = "", email = "",
    } = body;

    if (!name || !brandName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await appendRow("Join", [
      new Date().toISOString(),
      name, brandName, location, founded, category,
      description, portfolioUrl, instagramUrl, vision, email,
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submit-join error:", err);
    return NextResponse.json({ error: "Failed to record submission" }, { status: 500 });
  }
}
