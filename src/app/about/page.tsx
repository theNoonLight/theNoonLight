"use client";

import ProfileCard from "@/components/ProfileCard";

export default function AboutPage() {
  return (
    <div className="min-h-screen relative text-white bg-black" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                About TigerMonkey
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Where minds meet challenges and communities are built through the art of problem-solving.
              </p>
          <div className="w-32 h-1 bg-white mx-auto rounded-full mt-8"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* What We Do */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-4">What We Do</h2>
                <p className="text-gray-300 leading-relaxed">
                  TigerMonkey is a daily puzzle platform that challenges minds and builds community. 
                  Every day at noon PT, we release a new puzzle designed to test your problem-solving skills.
                  Our puzzles range from logic problems and cryptography challenges to creative thinking exercises.
                </p>
          </div>

          {/* Our Mission */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To create a global community of puzzle enthusiasts who challenge themselves daily and grow together through problem-solving.
              We believe that puzzles are more than entertainment—they&apos;re tools for developing critical thinking and fostering connections.
            </p>
          </div>

              {/* Meet the Team */}
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
                <h2 className="text-2xl font-bold text-white mb-6">Meet the Team</h2>
                <div className="grid md:grid-cols-3 gap-6">
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