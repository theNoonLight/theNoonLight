import Link from "next/link";
import Dither from "@/components/Dither";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Dither Background */}
      <div className="absolute inset-0 -z-10">
        <Dither />
      </div>
        
        {/* Main content centered */}
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center">
            <h1 className="text-black mb-8 lowercase tracking-tight" style={{ 
              textShadow: '0 0 1px white, 0 0 2px white, 0 0 3px white',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
              fontSize: 'clamp(4.5rem, 13vw, 8rem)',
              fontWeight: 600
            }}>
              the noon light
            </h1>
            
            <div className="mt-8 flex justify-center">
              <Link
                href="/today"
                className="bg-transparent text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-white/10 transition-all duration-200 backdrop-blur-sm border border-white/30 lowercase tracking-tight"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                today&apos;s puzzle
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
