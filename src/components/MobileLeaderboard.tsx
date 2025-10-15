"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MobileLeaderboard() {
  const { data: session } = useSession();
  const router = useRouter();
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

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
  };

  // Leaderboard is publicly accessible - no authentication required

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          {session && (
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Sign Out
            </button>
          )}
        </div>
        {session ? (
          <p className="text-gray-300 text-sm">
            Welcome, {session.user?.name}
          </p>
        ) : (
          <p className="text-gray-300 text-sm">
            View the top puzzle solvers
          </p>
        )}
        <div className="w-16 h-0.5 bg-white mt-2"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900/30 backdrop-blur-sm rounded-xl p-1 border border-gray-800/50">
        <button
          onClick={() => setActiveTab('overall')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'overall' 
              ? 'bg-white/20 text-white' 
              : 'text-gray-300 hover:bg-white/10'
          }`}
        >
          Overall
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
            activeTab === 'today' 
              ? 'bg-white/20 text-white' 
              : 'text-gray-300 hover:bg-white/10'
          }`}
        >
          Today&apos;s Fastest
        </button>
      </div>

      {/* Leaderboard Content */}
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 mb-6">
        {activeTab === 'overall' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Overall Rankings</h2>
            <div className="space-y-3">
              {users.slice(0, 8).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {user.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white truncate">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.puzzlesSolved} puzzles</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{user.totalScore}</div>
                    <div className="text-xs text-gray-400">pts</div>
                  </div>
                  <div className="text-lg ml-2">{getRankIcon(index + 1)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'today' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Today&apos;s Fastest</h2>
            <div className="space-y-3">
              {currentPuzzleLeaderboard.map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {users[index]?.avatar || "??"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white truncate">{entry.userName}</div>
                      <div className="text-xs text-gray-400">{entry.solveTime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{entry.score}</div>
                    <div className="text-xs text-gray-400">pts</div>
                  </div>
                  <div className="text-lg ml-2">{getRankIcon(index + 1)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile-specific info */}
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50">
        <h3 className="text-lg font-bold mb-2">Mobile Access</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          You&apos;re viewing the mobile version of The Noon Light. For the full experience including today&apos;s puzzle, please visit on desktop.
        </p>
      </div>
    </div>
  );
}
