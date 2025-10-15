import { useEffect, useState } from 'react';

// Comprehensive mobile detection utility
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Check user agent for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check screen dimensions (mobile typically has smaller screens)
  const isSmallScreen = screenWidth <= 768 || (screenWidth <= 1024 && screenHeight <= 768);
  
  // Check for mobile-specific features
  const isMobileOrientation = 'orientation' in window;
  const hasMobileViewport = window.matchMedia('(max-width: 768px)').matches;
  
  // Combine multiple indicators for more accurate detection
  const mobileScore = [
    isMobileUserAgent,
    isTouchDevice && isSmallScreen,
    hasMobileViewport,
    isMobileOrientation && isSmallScreen
  ].filter(Boolean).length;
  
  // Consider it mobile if 2 or more indicators are true
  return mobileScore >= 2;
}

// React hook for mobile detection with state management
export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobile(isMobileDevice());
    
    // Listen for resize events to update mobile detection
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Return false during SSR to prevent hydration mismatch
  return isClient ? isMobile : false;
}

// Utility to check if current route should be restricted on mobile
export function isMobileRestrictedRoute(pathname: string): boolean {
  const allowedMobileRoutes = ['/', '/leaderboard'];
  return !allowedMobileRoutes.includes(pathname);
}

// Utility to redirect mobile users to allowed routes
export function getMobileRedirectPath(pathname: string): string | null {
  if (isMobileRestrictedRoute(pathname)) {
    // If user is authenticated, redirect to leaderboard, otherwise to home
    return '/leaderboard'; // We'll determine auth status in the component
  }
  return null;
}

// Server-side mobile detection for middleware
export function isMobileDeviceSSR(userAgent: string): boolean {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}
