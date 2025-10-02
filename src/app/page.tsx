import Link from "next/link";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        background: 'radial-gradient(circle, #fb923c, #f97316, #ea580c)'
      }}
    >
      {/* Login button in top left */}
      <div className="absolute top-6 left-6">
        <LoginButton />
      </div>
      
      {/* Main content centered */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl md:text-9xl poppins-black text-white mb-12">
            The Noon Light
          </h1>
          
          <div className="space-y-6">
            <Link
              href="/today"
              className="inline-block bg-white text-orange-600 poppins-bold py-4 px-12 rounded-lg text-2xl hover:bg-orange-50 transition-colors duration-300 shadow-lg"
            >
              View Today&apos;s Puzzle
            </Link>
            
            <div className="mt-8">
              <a
                href="https://snehithn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg poppins-medium hover:text-orange-100 transition-colors duration-300 underline"
              >
                Visit my personal website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
