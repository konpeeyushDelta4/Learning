import React, { useEffect, useRef, useState } from "react";

const SilentCounter: React.FC = () => {
  // useRef for counting without re-renders
  const countRef = useRef<number>(0);
  // useState for displaying the value (will cause re-renders)
  const [displayCount, setDisplayCount] = useState<number>(0);
  // Track render count for demonstration
  const renderCount = useRef<number>(1);

  const incrementSilent = () => {
    // Incrementing ref doesn't cause a re-render
    countRef.current += 1;
    console.log("Silent count:", countRef.current);
  };

  const showCount = () => {
    // This will cause a re-render to show the current value
    setDisplayCount(countRef.current);
  };

  // Log and count renders
  useEffect(() => {
    renderCount.current += 1;
    console.log('Component rendered', renderCount.current, 'times');
  });

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-5 px-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
          useRef Silent Counter
        </h3>
        <p className="text-indigo-100 text-sm">Changes without triggering re-renders</p>
      </div>

      <div className="p-6">
        {/* Counter Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100 shadow-inner mb-6">
          <div className="flex justify-between items-end mb-1">
            <p className="text-sm text-blue-600 font-medium">Displayed Count:</p>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Renders: {renderCount.current}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {displayCount}
            </span>
          </div>
          <p className="text-xs text-center mt-2 text-blue-500">
            {displayCount !== countRef.current && (
              <span className="italic">Internal count: {countRef.current} (hidden)</span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={incrementSilent}
            className="group relative bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Increment Silently
            </span>
            <span className="absolute bg-indigo-500 w-0 h-full left-0 top-0 transition-all duration-300 group-hover:w-full"></span>
          </button>

          <button
            onClick={showCount}
            className="group relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Show Current Count
            </span>
          </button>
        </div>

        {/* Explanation */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-700 flex items-center mb-2">
            <svg className="w-4 h-4 mr-1 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            How It Works
          </h4>
          <div className="prose prose-sm text-gray-600">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">useRef</code> values persist between renders
              </li>
              <li>
                Changes to <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">ref.current</code> don't trigger re-renders
              </li>
              <li>
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">useState</code> updates cause component re-renders
              </li>
              <li>Notice how the render count only increases when displaying the count</li>
            </ul>
          </div>
        </div>
        
        {/* Console Tip */}
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 flex items-start">
          <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-yellow-800">
            Open your browser console (F12) to see the silent count updates and render logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SilentCounter;