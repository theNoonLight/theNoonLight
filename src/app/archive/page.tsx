"use client";

export default function ArchivePage() {
  // const [filter, setFilter] = useState<'all' | 'solved' | 'unsolved'>('all');
  // const [hoveredProblem, setHoveredProblem] = useState<number | null>(null);
  
  // Generate 20 puzzle placeholders with different earth tones
  const puzzles = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Puzzle #${i + 1}`,
    difficulty: ['easy', 'medium', 'hard', 'expert'][i % 4],
    color: [
      '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#F4A460',
      '#DEB887', '#F5DEB3', '#D2B48C', '#BC8F8F', '#DDA0DD',
      '#98FB98', '#F0E68C', '#FFB6C1', '#FFA07A', '#87CEEB',
      '#D8BFD8', '#F0F8FF', '#F5F5DC', '#FFF8DC', '#E6E6FA'
    ][i]
  }));

  // Future filter functionality
  // const filterOptions = [
  //   { id: 'all', label: 'All Puzzles', count: 0 },
  //   { id: 'solved', label: 'Solved', count: 0 },
  //   { id: 'unsolved', label: 'Unsolved', count: 0 },
  // ];

  // const famousProblems = [
  //   { 
  //     title: "P vs NP Problem", 
  //     desc: "One of the most important unsolved problems in computer science.",
  //     difficulty: "Unsolved",
  //     reward: "$1,000,000",
  //     color: "from-cyan-500 to-blue-500",
  //     icon: "💎"
  //   },
  //   { 
  //     title: "Riemann Hypothesis", 
  //     desc: "A conjecture about the distribution of prime numbers.",
  //     difficulty: "Unsolved",
  //     reward: "$1,000,000",
  //     color: "from-purple-500 to-pink-500",
  //     icon: "🔢"
  //   }
  // ];

  // const otherProblems = [
  //   { name: "Goldbach's Conjecture", status: "Open", year: "1742", icon: "🧮" },
  //   { name: "Four Color Theorem", status: "Solved", year: "1976", icon: "🎨" },
  //   { name: "Collatz Conjecture", status: "Open", year: "1937", icon: "🔄" },
  //   { name: "Fermat's Last Theorem", status: "Solved", year: "1995", icon: "📐" },
  //   { name: "Twin Prime Conjecture", status: "Open", year: "Ancient", icon: "👯" },
  //   { name: "Navier-Stokes Equations", status: "Open", year: "1850", icon: "🌊" }
  // ];

  return (
        <div className="min-h-screen relative text-white bg-black" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Puzzle Archive
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore past puzzles and famous unsolved problems.
          </p>
          <div className="w-32 h-1 bg-white mx-auto rounded-full mt-8"></div>
        </div>
        {/* Main Content */}
        <div className="space-y-16">
          {/* Puzzle Grid */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-6">Available Puzzles</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {puzzles.map((puzzle) => (
                <div 
                  key={puzzle.id}
                  className="group bg-gray-800/50 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-gray-600/50"
                >
                  <div 
                    className="w-full h-20 rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: puzzle.color }}
                  ></div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white mb-1">{puzzle.title}</div>
                    <div className="text-xs text-gray-400 capitalize">{puzzle.difficulty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
