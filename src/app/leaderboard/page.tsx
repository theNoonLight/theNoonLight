export default function LeaderboardPage() {
  // Empty arrays - no users yet
  const users: any[] = [];
  const currentPuzzleLeaderboard: any[] = [];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3: return "bg-gradient-to-r from-amber-600 to-amber-800";
      default: return "bg-gradient-to-r from-orange-100 to-orange-200";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See who's leading the pack in puzzle solving! Rankings are based on total puzzles solved 
            and fastest solve times for the current puzzle.
          </p>
          <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Overall Leaderboard */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Overall Rankings</h2>
              <span className="text-sm text-gray-500">Total Puzzles Solved</span>
            </div>
            
            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No users yet</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to solve puzzles and appear on the leaderboard!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center space-x-4 p-4 rounded-lg ${getRankColor(user.rank)}`}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-lg font-bold text-white">
                        {getRankIcon(user.rank)}
                      </span>
                    </div>
                    
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{user.avatar}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-white/80">
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xl font-bold text-white">{user.puzzlesSolved}</p>
                      <p className="text-xs text-white/80">puzzles</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Puzzle Leaderboard */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Puzzle</h2>
              <span className="text-sm text-gray-500">Fastest Solve Times</span>
            </div>
            
            {currentPuzzleLeaderboard.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No solve times yet</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to solve today's puzzle!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentPuzzleLeaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center space-x-4 p-4 rounded-lg ${getRankColor(user.rank)}`}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-lg font-bold text-white">
                        {getRankIcon(user.rank)}
                      </span>
                    </div>
                    
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{user.avatar}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-white truncate">
                        {user.name}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xl font-bold text-white">{user.timeTaken}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Note:</strong> Current puzzle leaderboard updates in real-time. 
                Times are recorded from when you start solving until you submit the correct answer.
              </p>
            </div>
          </div>
        </div>

        {/* Your Stats - Only show when user is logged in */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Sign in to track your progress</p>
            <p className="text-gray-400 text-sm mt-2">Your puzzle solving stats will appear here</p>
          </div>
        </div>

        {/* TBD Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900">Leaderboard Features Coming Soon</h3>
              <p className="text-blue-800 mt-1">
                We're working on advanced leaderboard features including monthly competitions, 
                achievement badges, and detailed statistics. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
