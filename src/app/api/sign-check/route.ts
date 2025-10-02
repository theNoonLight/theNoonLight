import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "puzzles";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path"); // e.g., 0001/puzzle0001.zip
    if (!path) return NextResponse.json({ ok:false, error:"missing ?path=" });

    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server key (private bucket)
    );

    const { data, error } = await supa.storage.from(BUCKET).createSignedUrl(path, 300);
    if (error) return NextResponse.json({ ok:false, where:"sign", error: error.message, path });

    return NextResponse.json({ ok:true, path, signedUrl: data?.signedUrl ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok:false, where:"sign-catch", error: e?.message ?? String(e) });
  }
}
