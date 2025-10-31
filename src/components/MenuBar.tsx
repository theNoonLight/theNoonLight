"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMobileDetection } from "@/lib/mobileDetection";

export default function MenuBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();

  // Close dropdown when route changes or clicking outside
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { href: "/today", label: "Today's Puzzle" },
    { href: "/about", label: "About" },
    { href: "/archive", label: "Archive" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/ide", label: "IDE" },
  ];

  const isActive = (href: string) => pathname === href;
  const isIDEPage = pathname === "/ide";

  const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

  // Hide MenuBar on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isIDEPage ? 'bg-zinc-800/95 backdrop-blur-sm border-b border-zinc-700/50' : ''}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo and Hamburger Menu Button - Absolute Left */}
          <div className="absolute left-4 z-10 flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image src="/tigermonkey_logo.svg" alt="TigerMonkey" width={32} height={32} />
            </Link>
            <div ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 text-white hover:bg-white/10 focus:ring-white/20 focus:outline-none focus:ring-2 backdrop-blur-sm"
                aria-expanded={isDropdownOpen}
                aria-label="Toggle navigation menu"
              >
                {/* Hamburger Icon */}
                <svg
                  className={`${isDropdownOpen ? 'hidden' : 'block'} transition-transform duration-200`}
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                
                {/* Close Icon */}
                <svg
                  className={`${isDropdownOpen ? 'block' : 'hidden'} transition-transform duration-200`}
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
              <div 
                className="absolute left-0 mt-3 w-64 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-300 tracking-tight" 
                style={{ 
                  fontFamily,
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 100%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                  <div className="py-3 px-4 space-y-1">
                    {/* Home Link */}
                    <Link
                      href="/"
                      className={`block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                        isActive('/')
                          ? 'text-white translate-x-2 scale-102'
                          : 'text-white hover:translate-x-2 hover:scale-102'
                      }`}
                      style={isActive('/') ? { backgroundColor: 'rgba(227, 134, 26, 0.3)' } : {}}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Home
                    </Link>

                    {/* Menu Items */}
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${
                          isActive(item.href)
                            ? 'text-white translate-x-2 scale-102'
                            : 'text-white hover:translate-x-2 hover:scale-102'
                        }`}
                        style={isActive(item.href) ? { backgroundColor: 'rgba(227, 134, 26, 0.3)' } : {}}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spacer to push sign-in to the right */}
          <div className="flex-1"></div>

          {/* Google Sign-in Button - Top Right */}
          <div className="absolute right-4">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-5 h-5 bg-white/40 rounded-full"></div>
              </div>
            ) : session ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm border border-white/30"
                  type="button"
                >
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium drop-shadow-sm text-white" style={{ color: 'white', zIndex: 10, position: 'relative' }}>
                      {session.user?.name}
                    </div>
                    <div className="text-xs drop-shadow-sm text-white/80" style={{ color: 'rgba(255, 255, 255, 0.8)', zIndex: 10, position: 'relative' }}>
                      Puzzles solved: 0
                    </div>
                  </div>
                  
                  <div className="relative">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user?.name || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/40 transition-colors duration-200"
                        onError={(e) => {
                          // Hide the image and show the fallback
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          fallback?.style.setProperty('display', 'flex');
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/40 transition-colors duration-200 flex items-center justify-center"
                      style={{ backgroundColor: '#E3861A', display: session.user?.image ? 'none' : 'flex' }}
                    >
                      <span className="text-white text-xs font-medium">
                        {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl transform transition-all duration-300 tracking-tight z-50" 
                    style={{ 
                      fontFamily,
                      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 100%)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div className="py-3 px-4">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-white transition-all duration-200 rounded-lg"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-transparent hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/30 flex items-center gap-2 text-white lowercase tracking-tight text-sm"
                style={{ fontFamily }}
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
                <span className="text-sm font-medium">Sign In With Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}