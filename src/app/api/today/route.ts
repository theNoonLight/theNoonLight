import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "puzzles";

export async function GET() {
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // MVP: latest published puzzle
  const { data: rows, error } = await supa
    .from("puzzles")
    .select("*")
    .eq("published", true)
    .order("date_utc", { ascending: false })
    .limit(1);

  if (error || !rows?.length) return NextResponse.json({ available: false });

  const p = rows[0];

  const { data: signed, error: signErr } = await supa.storage
    .from(BUCKET)
    .createSignedUrl(p.storage_path, 300); // 5 min

  if (signErr || !signed?.signedUrl) return NextResponse.json({ available: false });

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
}
