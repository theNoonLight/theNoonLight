"use client";

import { useEffect, useState } from "react";

type TodayPayload = {
  available: boolean;
  puzzle?: {
    id: number;
    date: string;
    title: string;
    summary: string;
    downloadUrl: string;
  };
  _debug?: Record<string, unknown>;
};

export default function TodayClient() {
  const [data, setData] = useState<TodayPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/today", { cache: "no-store" });
        const json = (await res.json()) as TodayPayload;
        if (alive) setData(json);
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (err) {
    return (
      <div className="text-red-600">
        Something went wrong loading today’s puzzle. {err}
      </div>
    );
  }

  if (!data) {
    return <div className="text-gray-500">Loading…</div>;
  }

  if (!data.available || !data.puzzle) {
    return <p className="text-gray-500">Come back at noon PT for the drop.</p>;
  }

  return (
    <>
      <h2 className="text-xl font-medium">{data.puzzle.title}</h2>
      <p className="text-gray-700 mb-4">{data.puzzle.summary}</p>
      <a
        className="inline-block rounded border px-4 py-2"
        href={data.puzzle.downloadUrl}
      >
        Download Puzzle (.zip)
      </a>

    <form
        className="mt-6 space-y-3"
        action="/api/submit"
        method="post"
        target="_blank"
        >
        <input type="hidden" name="puzzleId" value={data.puzzle.id} />
        <label className="block text-sm font-medium">Your Answer</label>
        <input
            type="text"
            name="answer"
            placeholder="Type your answer…"
            className="w-full rounded border px-3 py-2"
        />
        <button
            type="submit"
            className="rounded bg-black text-white px-4 py-2"
        >
            Submit Answer
        </button>
    </form>

    </>
  );
}
