import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const puzzleId = searchParams.get("puzzleId");

    if (!puzzleId) {
      return NextResponse.json({ ok: false, error: "puzzleId required" }, { status: 400 });
    }

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "not authenticated" }, { status: 401 });
    }

    // Get user ID from database
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ ok: false, error: "user not found" }, { status: 404 });
    }

    // Get user's submissions for this puzzle
    const { data: submissions, error } = await supabaseAdmin
      .from("submissions")
      .select("attempts, solved, created_at, answer_raw")
      .eq("puzzle_id", puzzleId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      submissions: submissions || [],
      totalAttempts: submissions?.[0]?.attempts || 0
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
