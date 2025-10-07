import Link from "next/link";
import LoginButton from "@/components/LoginButton";
import Dither from "@/components/Dither";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Dither Background */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.3}
          waveColor={[1.0, 1.0, 1.0]} // White color
          colorNum={4}
          pixelSize={2}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={1}
        />
      </div>
      
      {/* Login button in top left */}
      <div className="absolute top-6 left-6 z-10">
        <LoginButton />
      </div>
      
      {/* Main content centered */}
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <h1 className="text-8xl md:text-9xl poppins-black text-white mb-12 drop-shadow-lg">
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
                className="text-white text-lg poppins-medium hover:text-orange-100 transition-colors duration-300 underline drop-shadow-md"
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
