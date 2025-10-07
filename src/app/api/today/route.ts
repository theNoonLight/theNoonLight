import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "puzzles";

export async function GET() {
  try {
    // Use service role on the server for private bucket signing
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // latest published puzzle
    const { data: rows, error } = await supa
      .from("puzzles")
      .select("*")
      .eq("published", true)
      .order("date_utc", { ascending: false })
      .limit(1);

    if (error || !rows?.length) {
      return NextResponse.json({ available: false }, { status: 200 });
    }

    const p = rows[0];

    // sign a short-lived URL for the zip
    const { data: signed, error: signErr } = await supa
      .storage
      .from(BUCKET)
      .createSignedUrl(p.storage_path, 300);

    if (signErr || !signed?.signedUrl) {
      return NextResponse.json({ available: false }, { status: 200 });
    }  

    return NextResponse.json({
      available: true,
      puzzle: {
        id: p.id,
        date: p.date_utc,
        title: p.title,
        summary: p.summary,
        downloadUrl: signed.signedUrl
      }
    });
  } catch { 
    return NextResponse.json({ available: false }, { status: 200 });
  }
}
