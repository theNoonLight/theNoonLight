import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeAnswer, hashAnswer } from "@/lib/normalize";

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

    let correct = false;
    if (puzzle.answer_mode === "hash" && puzzle.answer_hash === hash) {
      correct = true;
    } else if (puzzle.answer_mode === "regex") {
      const pattern = new RegExp(puzzle.answer_regex ?? "", "i");
      correct = pattern.test(norm);
    }

    await supabaseAdmin.from("submissions").insert({
      puzzle_id: puzzleId,
      answer_raw: answer,
      answer_norm: norm,
      correct,
      ip,
      user_agent: userAgent,
    });

    return NextResponse.json({ ok: true, correct });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
