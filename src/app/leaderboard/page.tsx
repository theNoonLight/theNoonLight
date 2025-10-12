"use client";

import { useState } from "react";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'overall' | 'today'>('overall');
  
  // Mock users for overall leaderboard
  const users = [
    { id: 1, name: "Alex Chen", puzzlesSolved: 47, totalScore: 2840, avatar: "AC" },
    { id: 2, name: "Sarah Kim", puzzlesSolved: 43, totalScore: 2620, avatar: "SK" },
    { id: 3, name: "Marcus Johnson", puzzlesSolved: 39, totalScore: 2380, avatar: "MJ" },
    { id: 4, name: "Emma Wilson", puzzlesSolved: 35, totalScore: 2150, avatar: "EW" },
    { id: 5, name: "David Park", puzzlesSolved: 32, totalScore: 1980, avatar: "DP" },
    { id: 6, name: "Lisa Rodriguez", puzzlesSolved: 28, totalScore: 1720, avatar: "LR" },
    { id: 7, name: "James Taylor", puzzlesSolved: 25, totalScore: 1550, avatar: "JT" },
    { id: 8, name: "Maria Garcia", puzzlesSolved: 22, totalScore: 1380, avatar: "MG" },
    { id: 9, name: "Chris Anderson", puzzlesSolved: 19, totalScore: 1190, avatar: "CA" },
    { id: 10, name: "Anna Lee", puzzlesSolved: 16, totalScore: 980, avatar: "AL" }
  ];
  
  // Mock users for today's puzzle leaderboard
  const currentPuzzleLeaderboard = [
    { id: 1, userName: "Alex Chen", solveTime: "2:34", score: 150 },
    { id: 2, userName: "Sarah Kim", solveTime: "3:12", score: 145 },
    { id: 3, userName: "Marcus Johnson", solveTime: "3:45", score: 140 },
    { id: 4, userName: "Emma Wilson", solveTime: "4:22", score: 135 },
    { id: 5, userName: "David Park", solveTime: "5:18", score: 130 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
  };

  return (
        <div className="min-h-screen relative text-white bg-black" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            See who's leading in puzzle solving.
          </p>
          <div className="w-32 h-1 bg-white mx-auto rounded-full mt-8"></div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-12 bg-gray-900/30 backdrop-blur-sm rounded-xl p-2 border border-gray-800/50">
          <button
            onClick={() => setActiveTab('overall')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'overall' 
                ? 'bg-white/20 text-white' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            Overall Rankings
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'today' 
                ? 'bg-white/20 text-white' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            Today's Fastest
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Leaderboard Features Coming Soon */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-4">Leaderboard Features Coming Soon</h2>
            <p className="text-gray-300 leading-relaxed">
              We're working on advanced leaderboard features including monthly competitions, achievement badges, detailed analytics, and team rankings. Stay tuned for exciting updates!
            </p>
          </div>

          {/* Leaderboard Content */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
            {activeTab === 'overall' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Overall Rankings</h2>
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-white">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.puzzlesSolved} puzzles solved</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{user.totalScore}</div>
                        <div className="text-sm text-gray-400">points</div>
                      </div>
                      <div className="text-2xl">{getRankIcon(index + 1)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'today' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Today's Fastest</h2>
                <div className="space-y-4">
                  {currentPuzzleLeaderboard.map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-white">
                          {users[index]?.avatar || "??"}
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">{entry.userName}</div>
                          <div className="text-sm text-gray-400">Solved in {entry.solveTime}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{entry.score}</div>
                        <div className="text-sm text-gray-400">points</div>
                      </div>
                      <div className="text-2xl">{getRankIcon(index + 1)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
