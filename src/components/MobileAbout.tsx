"use client";

import { useSession } from "next-auth/react";
import ProfileCard from "@/components/ProfileCard";

export default function MobileAbout() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen relative text-white bg-black" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">About</h1>
          {session && (
            <button
              onClick={() => window.location.href = '/leaderboard'}
              className="ml-auto text-gray-400 hover:text-white transition-colors text-sm"
            >
              Leaderboard
            </button>
          )}
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            About The Noon Light
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Where minds meet challenges and communities are built through the art of problem-solving.
          </p>
          <div className="w-24 h-1 bg-white mx-auto rounded-full mt-6"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What We Do */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-3">What We Do</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              The Noon Light is a daily puzzle platform that challenges minds and builds community. 
              Every day at noon PT, we release a new puzzle designed to test your problem-solving skills.
              Our puzzles range from logic problems and cryptography challenges to creative thinking exercises.
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              To create a global community of puzzle enthusiasts who challenge themselves daily and grow together through problem-solving.
              We believe that puzzles are more than entertainment—they&apos;re tools for developing critical thinking and fostering connections.
            </p>
          </div>

          {/* Meet the Team */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
            <h3 className="text-xl font-bold text-white mb-4">Meet the Team</h3>
            <div className="space-y-4">
              <ProfileCard
                name="Snehith Nayak"
              />
              <ProfileCard
                name="Aman Kumpawat"
              />
              <ProfileCard
                name="Vishal Victor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
