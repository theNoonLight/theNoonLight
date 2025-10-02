import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server key
    );

    const { data, error } = await supa
      .from("puzzles")
      .select("id,date_utc,title,published,storage_path")
      .order("date_utc", { ascending: false })
      .limit(5);

    if (error) {
      return NextResponse.json({ ok: false, where: "db", error: error.message });
    }
    return NextResponse.json({ ok: true, rows: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, where: "db-catch", error: msg });
  }
}
