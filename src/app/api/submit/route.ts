import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeAnswer, hashAnswer } from "@/lib/normalize";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const form = await req.formData();
    const answer = String(form.get("answer") ?? "");
    const puzzleId = Number(form.get("puzzleId") ?? "0");
    const ip = req.headers.get("x-forwarded-for") ?? null;
    const userAgent = req.headers.get("user-agent") ?? null;

    if (!answer || !puzzleId) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    // Get user session
    const session = await getServerSession(authOptions);
    let userId: string | null = null;

    if (session?.user?.email) {
      // Get user ID from database
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();
      
      userId = user?.id || null;
    }

    const norm = normalizeAnswer(answer);
    const hash = hashAnswer(answer);

    // get correct hash from puzzle
    const { data: puzzle, error } = await supabaseAdmin
      .from("puzzles")
      .select("answer_mode, answer_hash, answer_regex")
      .eq("id", puzzleId)
      .single();

    if (error || !puzzle) {
      return NextResponse.json({ ok: false, error: "invalid puzzle" }, { status: 400 });
    }

    // Check if answer is correct
    let isCorrect = false;
    if (puzzle.answer_mode === "hash" && puzzle.answer_hash === hash) {
      isCorrect = true;
    } else if (puzzle.answer_mode === "regex") {
      const pattern = new RegExp(puzzle.answer_regex ?? "", "i");
      isCorrect = pattern.test(norm);
    }

    // Use upsert to either insert new submission or increment attempts
    // Only query existing submission if we have a user ID
    let existingSubmission = null;
    if (userId) {
      const { data } = await supabaseAdmin
        .from("submissions")
        .select("attempts")
        .eq("puzzle_id", puzzleId)
        .eq("user_id", userId)
        .single();
      existingSubmission = data;
    }

    const newAttempts = (existingSubmission?.attempts || 0) + 1;

    // Insert or update submission
    if (userId) {
      // User is authenticated - use upsert with unique constraint
      await supabaseAdmin.from("submissions").upsert({
        puzzle_id: puzzleId,
        user_id: userId,
        answer_raw: answer,
        answer_norm: norm,
        attempts: newAttempts,
        ip,
        user_agent: userAgent,
      }, {
        onConflict: "puzzle_id,user_id"
      });
    } else {
      // Anonymous user - just insert new record
      await supabaseAdmin.from("submissions").insert({
        puzzle_id: puzzleId,
        user_id: null,
        answer_raw: answer,
        answer_norm: norm,
        attempts: 1,
        ip,
        user_agent: userAgent,
      });
    }

    return NextResponse.json({ 
      ok: true, 
      correct: isCorrect, 
      attempts: newAttempts 
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
