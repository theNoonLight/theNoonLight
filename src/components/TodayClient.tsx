"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type TodayPayload = {
  available: boolean;
  puzzle?: {
    id: number;
    date: string;
    title: string;
    summary: string;
    downloadUrl: string;
  };
};

export default function TodayClient() {
  const [data, setData] = useState<TodayPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{correct: boolean, attempts: number, message?: string} | null>(null);
  const { data: session } = useSession();

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
        Something went wrong loading today&apos;s puzzle. {err}
      </div>
    );
  }

  if (!data) {
    return <div className="text-gray-500">Loading...</div>;
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
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          try {
            const response = await fetch("/api/submit", {
              method: "POST",
              body: formData,
            });
            const result = await response.json();
            setSubmissionResult({ 
              correct: result.correct, 
              attempts: result.attempts, 
              message: result.message 
            });
          } catch (error) {
            console.error("Submission error:", error);
          }
        }}
        >
        <input type="hidden" name="puzzleId" value={data.puzzle.id} />
        <label className="block text-sm font-medium">Your Answer</label>
        <input
            type="text"
            name="answer"
            placeholder="Type your answer…"
            className="w-full rounded border px-3 py-2"
            required
        />
        <button
            type="submit"
            className="rounded bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
        >
            Submit Answer
        </button>
    </form>

    {submissionResult && (
      <div className={`mt-4 p-3 rounded ${submissionResult.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {submissionResult.correct ? (
          <p className="font-medium">
            {submissionResult.message || `🎉 Correct! You solved it in ${submissionResult.attempts} attempt${submissionResult.attempts !== 1 ? 's' : ''}!`}
          </p>
        ) : (
          <p>❌ Not quite right. This was attempt #{submissionResult.attempts}. Keep trying!</p>
        )}
      </div>
    )}

    {session && (
      <div className="mt-4 text-sm text-gray-600">
        Logged in as {session.user?.name}
      </div>
    )}

    </>
  );
}
