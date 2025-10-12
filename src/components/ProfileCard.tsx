"use client";

import { useState } from "react";

interface ProfileCardProps {
  name: string;
  avatar?: string;
  bio?: string;
  stats?: {
    puzzles: number;
    rank: number;
    streak: number;
  };
}

export default function ProfileCard({ name, avatar, bio, stats }: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          {isHovered && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-900 rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-gray-200 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-gray-400">Co-Founder</p>
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          {bio}
        </p>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{stats.puzzles}</div>
            <div className="text-xs text-gray-400">Puzzles</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">#{stats.rank}</div>
            <div className="text-xs text-gray-400">Rank</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{stats.streak}</div>
            <div className="text-xs text-gray-400">Streak</div>
          </div>
        </div>
      )}

      {/* Hover Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
}
