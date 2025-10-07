export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About The Noon Light
          </h1>
          <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Noon Light is a daily puzzle platform that challenges minds and builds community. 
              Every day at noon PT, we release a new puzzle designed to test your problem-solving skills, 
              creativity, and perseverance.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our puzzles range from logic problems and cryptography challenges to creative thinking exercises. 
              Whether you're a seasoned puzzle solver or just getting started, there's something here for everyone.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Contribute</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We're always looking for puzzle creators to join our community! Here's how you can contribute:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Submit your original puzzle ideas through our contact form</li>
              <li>Join our Discord community to discuss puzzle creation</li>
              <li>Participate in our puzzle design workshops</li>
              <li>Share feedback on existing puzzles to help us improve</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">SN</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Snehith Nayak</h3>
                <p className="text-gray-600">Co-Founder</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">AK</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Aman Kumpawat</h3>
                <p className="text-gray-600">Co-Founder</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">VV</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Vishal Victor</h3>
                <p className="text-gray-600">Co-Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
