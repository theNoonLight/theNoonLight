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

export default function TodayPage() {
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

  return (
    <div className="min-h-screen relative text-white bg-black" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Current Puzzle
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Stay Tuned for New Challenges!
          </p>
          <div className="w-32 h-1 bg-white mx-auto rounded-full mt-8"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {err ? (
            <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-8 border border-red-800/50">
              <h2 className="text-2xl font-bold text-red-300 mb-4">Error</h2>
              <p className="text-red-200">Something went wrong loading Today&apos;s Puzzle. {err}</p>
            </div>
          ) : !data ? (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
              <p className="text-gray-300 text-center">Loading puzzle...</p>
            </div>
          ) : !data.available || !data.puzzle ? (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
              <h2 className="text-2xl font-bold text-white mb-4">Puzzle Coming Soon</h2>
              <p className="text-gray-300 leading-relaxed">
                Come back at noon PT for Today&apos;s Puzzle drop!
              </p>
            </div>
          ) : (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
              <h2 className="text-3xl font-bold text-white mb-4">{data.puzzle.title}</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{data.puzzle.summary}</p>
              
              {session ? (
                <>
                  <a
                    className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                    href={data.puzzle.downloadUrl}
                    download
                  >
                    Download Puzzle (.zip)
                  </a>

                  <form
                    className="mt-8 space-y-4"
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
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Your Answer</label>
                      <input
                        type="text"
                        name="answer"
                        placeholder="Type your answer..."
                        className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-500 focus:border-white/50 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-white text-black px-6 py-3 font-semibold hover:bg-gray-200 transition-all duration-200"
                    >
                      Submit Answer
                    </button>
                  </form>

                  {submissionResult && (
                    <div className={`mt-6 p-4 rounded-xl ${submissionResult.correct ? 'bg-green-900/30 border border-green-800/50' : 'bg-red-900/30 border border-red-800/50'}`}>
                      {submissionResult.correct ? (
                        <p className="font-medium text-green-300">
                          {submissionResult.message || `🎉 Correct! You solved it in ${submissionResult.attempts} attempt${submissionResult.attempts !== 1 ? 's' : ''}!`}
                        </p>
                      ) : (
                        <p className="text-red-300">❌ Not quite right. This was attempt #{submissionResult.attempts}. Keep trying!</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-8 p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 text-center">
                  <p className="text-gray-300 text-lg">
                    Sign in to view and submit the puzzle
                  </p>
                </div>
              )}

            </div>
          )}

          {/* Puzzle Categories */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-6">Puzzle Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🔄</div>
                <div>
                  <div className="text-lg font-semibold text-white">Algorithms</div>
                  <div className="text-sm text-gray-400">Master sorting, searching, and optimization</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📊</div>
                <div>
                  <div className="text-lg font-semibold text-white">Data Structures</div>
                  <div className="text-sm text-gray-400">Work with arrays, trees, graphs, and more</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🏗️</div>
                <div>
                  <div className="text-lg font-semibold text-white">System Design</div>
                  <div className="text-sm text-gray-400">Design scalable systems and distributed computing</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🔐</div>
                <div>
                  <div className="text-lg font-semibold text-white">Cryptography</div>
                  <div className="text-sm text-gray-400">Solve cryptographic puzzles and security challenges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
