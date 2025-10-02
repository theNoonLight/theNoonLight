import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <main className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white mb-6">
              The Noon Light
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8">
              Daily puzzles that challenge your mind
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🧩</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                Daily Puzzles
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Fresh puzzles drop every day at noon PT
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                Instant Feedback
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Submit your answers and get immediate validation
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                Multiple Formats
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Puzzles come in various formats and difficulty levels
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Solve Today&apos;s Puzzle?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Challenge yourself with our latest brain teaser
            </p>
            <Link
              href="/today"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-lg text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View Today&apos;s Puzzle →
            </Link>
          </div>

          {/* How it Works */}
          <div className="text-left max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              How It Works
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Visit Today&apos;s Puzzle
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Check out the daily puzzle page to see what&apos;s available
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Download & Solve
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Download the puzzle files and work on solving them
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Submit Your Answer
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Enter your solution and get instant feedback on correctness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <p>&copy; 2025 The Noon Light. Daily puzzles for curious minds.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
