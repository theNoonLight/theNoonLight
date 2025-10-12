"use client";

import { useState } from "react";

export default function TodayPage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  
  const difficulties = [
    { id: 'easy', label: 'Easy', color: 'from-green-500 to-emerald-600' },
    { id: 'medium', label: 'Medium', color: 'from-yellow-500 to-orange-600' },
    { id: 'hard', label: 'Hard', color: 'from-orange-500 to-red-600' },
    { id: 'expert', label: 'Expert', color: 'from-red-500 to-pink-600' },
  ];

  return (
        <div className="min-h-screen relative text-white bg-black" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Today's Puzzle
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            New challenges released daily at noon PT.
          </p>
          <div className="w-32 h-1 bg-white mx-auto rounded-full mt-8"></div>
        </div>
        {/* Main Content */}
        <div className="space-y-16">
          {/* Puzzle Coming Soon */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-4">Puzzle Coming Soon</h2>
            <p className="text-gray-300 leading-relaxed">
              We're preparing engaging computer science challenges for you. Check back soon for your first puzzle!
            </p>
          </div>

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
