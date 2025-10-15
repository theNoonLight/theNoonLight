"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dither from "@/components/Dither";

export default function MobileLanding() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to leaderboard
    if (session) {
      router.push('/leaderboard');
    }
  }, [session, router]);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/leaderboard" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 -z-10">
          <Dither />
        </div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Dither Background */}
      <div className="absolute inset-0 -z-10">
        <Dither />
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="text-center max-w-sm w-full">
        {/* Title */}
        <h1 
          className="text-white mb-6 lowercase tracking-tight"
          style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            fontSize: 'clamp(3rem, 12vw, 4rem)',
            fontWeight: 600,
            lineHeight: 1.1
          }}
        >
          the noon light
        </h1>


        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="bg-transparent text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200 border border-white/30 flex items-center justify-center gap-3 mx-auto"
          style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            transform: 'scale(0.9)'
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        </div>
      </div>
      
      {/* Footer - Fixed at bottom */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-white text-sm">
          Visit the desktop page to view and submit puzzles
        </p>
      </div>
    </div>
  );
}
