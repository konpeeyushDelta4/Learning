import React from "react";
import { Link } from "react-router-dom";

interface UtilInfo {
  name: string;
  path: string;
  description: string;
  icon?: string; // Added icon property for visual enhancement
}

const Home: React.FC = () => {
  const utils: UtilInfo[] = [
    {
      name: "useMemo",
      path: "/memo",
      description: "Memoize expensive calculations to optimize performance",
      icon: "🧠", // Brain emoji representing memory/thinking
    },
    {
      name: "useCallback",
      path: "/callback",
      description: "Memoize functions to prevent unnecessary re-renders",
      icon: "🔄", // Recycle/refresh emoji representing callbacks
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 inline-block text-transparent bg-clip-text">React Hooks Demo</h1>
        <p className="text-gray-600 text-xl">Understanding useCallback and useMemo in real-world applications</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {utils.map((util) => (
          <Link key={util.path} to={util.path} className="block p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3" role="img" aria-label={util.name}>
                {util.icon}
              </span>
              <h2 className="text-2xl font-semibold text-blue-600">{util.name}</h2>
            </div>
            <p className="text-gray-600 text-lg">{util.description}</p>
            <div className="mt-4 text-blue-500 font-medium flex items-center">
              Learn more
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
