export default function ArchivePage() {
  // Empty array - no puzzles yet
  const puzzles: any[] = [];

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-yellow-100 text-yellow-800";
      case 3: return "bg-orange-100 text-orange-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      default: return "Expert";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Puzzle Archive
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of past puzzles. Download the files and try to solve them, 
            or check out the solutions if you're stuck.
          </p>
          <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Puzzle Grid */}
        {puzzles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center mb-12">
            <div className="text-gray-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Puzzles Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Our puzzle archive is empty right now. Check back soon for a collection of challenging puzzles!
            </p>
            <p className="text-gray-500 text-sm">
              Puzzles will be added here after they've been featured as daily puzzles.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {puzzles.map((puzzle) => (
              <div key={puzzle.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(puzzle.difficulty)}`}>
                      {getDifficultyText(puzzle.difficulty)}
                    </div>
                    {puzzle.solved && (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{puzzle.title}</h3>
                  <p className="text-gray-600 mb-4">{puzzle.date}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{puzzle.type} Puzzle</span>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors duration-200">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Millennium Prize Problems Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Millennium Prize Problems</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Explore some of the most famous unsolved problems in mathematics. These are not puzzles 
            in the traditional sense, but rather deep mathematical challenges that have stumped 
            the world's greatest minds.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">P vs NP Problem</h3>
              <p className="text-gray-600 text-sm">
                One of the most important unsolved problems in computer science and mathematics.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Riemann Hypothesis</h3>
              <p className="text-gray-600 text-sm">
                A conjecture about the distribution of prime numbers that remains unproven.
              </p>
            </div>
          </div>
        </div>

        {/* Other Famous Problems */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Other Famous Problems</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Goldbach's Conjecture</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Collatz Conjecture</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Twin Prime Conjecture</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Four Color Theorem</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Fermat's Last Theorem</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Navier-Stokes Equations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
