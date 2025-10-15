import { useEffect, useState } from 'react';

// Comprehensive mobile detection utility
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent;
  const screenWidth = window.innerWidth;
  
  // Check user agent for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);
  
  // Check screen width (primary indicator for dev tools testing)
  const isSmallScreen = screenWidth <= 768;
  
  // Check for mobile viewport media query
  const hasMobileViewport = window.matchMedia('(max-width: 768px)').matches;
  
  // For development/testing: prioritize screen width and viewport
  // For production: use user agent as primary indicator
  if (process.env.NODE_ENV === 'development') {
    return isSmallScreen || hasMobileViewport;
  }
  
  // Production: combine user agent with screen size
  return isMobileUserAgent || (isSmallScreen && hasMobileViewport);
}

// React hook for mobile detection with state management
export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with a quick check if we're on the client
    if (typeof window !== 'undefined') {
      return isMobileDevice();
    }
    return false;
  });

  useEffect(() => {
    // Update mobile detection on mount
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

  return isMobile;
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
