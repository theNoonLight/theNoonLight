"use client";

import { useMobileDetection } from "@/lib/mobileDetection";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import MobileLanding from "./MobileLanding";
import MobileLeaderboard from "./MobileLeaderboard";
import MobileAbout from "./MobileAbout";

interface MobileWrapperProps {
  children: React.ReactNode;
}

export default function MobileWrapper({ children }: MobileWrapperProps) {
  const isMobile = useMobileDetection();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!isMobile) return; // Only apply mobile logic on mobile devices

    // Wait for session to load
    if (status === "loading") return;

    // If trying to access leaderboard without login, redirect to landing
    if (pathname === '/leaderboard' && !session) {
      router.replace('/');
      return;
    }

    // Define allowed mobile routes
    const allowedMobileRoutes = ['/', '/about', '/leaderboard'];
    const isCurrentRouteAllowed = allowedMobileRoutes.includes(pathname);

    if (!isCurrentRouteAllowed) {
      // Redirect to appropriate page based on login status
      router.replace(session ? '/leaderboard' : '/');
    }
  }, [isMobile, pathname, router, session, status]);

  // If not mobile, render the normal desktop content
  if (!isMobile) {
    return <>{children}</>;
  }

  // Mobile-specific routing
  if (pathname === '/') {
    return <MobileLanding />;
  }

  if (pathname === '/about') {
    return <MobileAbout />;
  }

  if (pathname === '/leaderboard') {
    // Only show leaderboard if user is logged in
    if (session) {
      return <MobileLeaderboard />;
    } else {
      // Redirect to landing if not logged in
      if (typeof window !== 'undefined') {
        router.replace('/');
      }
      return null;
    }
  }

  // For any other mobile routes, redirect to home
  if (typeof window !== 'undefined') {
    router.replace('/');
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  );
}
