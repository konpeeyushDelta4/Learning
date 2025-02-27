import React, { useState, useEffect, useLayoutEffect } from "react";

const SimpleLayoutExample: React.FC = () => {
  const [size, setSize] = useState<number>(20);
  const [useLayoutVersion, setUseLayoutVersion] = useState<boolean>(false);

  // Toggle between useEffect and useLayoutEffect demos
  const toggleDemo = () => setUseLayoutVersion(!useLayoutVersion);

  // Using regular useEffect - might cause flickering
  useEffect(() => {
    if (!useLayoutVersion) {
      // This can cause a visible flash
      setSize(10);
      // Simulate some work
      const start = performance.now();
      while (performance.now() - start < 50) {
        // Blocking for 50ms
      }
      // Final size
      setSize(50);
    }
  }, [useLayoutVersion]);

  // Using useLayoutEffect - prevents flickering
  useLayoutEffect(() => {
    if (useLayoutVersion) {
      // This change happens before paint, so user never sees size=10
      setSize(10);
      // Simulate some work
      const start = performance.now();
      while (performance.now() - start < 50) {
        // Blocking for 50ms
      }
      // Final size - user only sees this size
      setSize(50);
    }
  }, [useLayoutVersion]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header with gradient background */}
      <div className={`py-5 px-6 ${
        useLayoutVersion 
          ? "bg-gradient-to-r from-green-600 to-emerald-600" 
          : "bg-gradient-to-r from-blue-600 to-indigo-600"
      }`}>
        <h2 className="text-xl font-bold text-white flex items-center">
          {useLayoutVersion ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              useLayoutEffect Demo
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              useEffect Demo
            </>
          )}
        </h2>
        <p className="text-sm opacity-80">
          {useLayoutVersion 
            ? "Synchronous, runs before browser paint" 
            : "Asynchronous, runs after browser paint"}
        </p>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        {/* Demo visualization */}
        <div className="mt-2 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
          <div className="relative flex justify-center items-center mb-4 w-full">
            <div className="absolute w-full h-1 bg-gray-200"></div>
            <div className="relative flex space-x-8">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Initial</span>
                <div className="rounded-full bg-gray-300" style={{ width: '20px', height: '20px' }}></div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Interim</span>
                <div className={`rounded-full ${useLayoutVersion ? 'opacity-25' : ''}`} 
                  style={{ 
                    width: '10px', 
                    height: '10px',
                    backgroundColor: useLayoutVersion ? '#10B981' : '#3B82F6'
                  }}>
                </div>
                {useLayoutVersion && (
                  <span className="text-xs text-red-500 mt-1">(Never seen)</span>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Final</span>
                <div className="rounded-full" 
                  style={{ 
                    width: '50px', 
                    height: '50px',
                    backgroundColor: useLayoutVersion ? '#10B981' : '#3B82F6'
                  }}>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center mt-8">
            <div
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: useLayoutVersion ? "#10B981" : "#3B82F6",
                transition: "background-color 0.5s ease",
              }}
              className="rounded-full shadow-md transform hover:scale-105 transition-transform"
            />
          </div>
          
          <p className="mt-4 text-center text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
            {useLayoutVersion 
              ? "The circle jumps directly to 50px (10px never renders)" 
              : "Watch closely! You might see a brief flash at 10px size"}
          </p>
        </div>
        
        {/* Information box */}
        <div className={`mt-6 p-4 rounded-lg text-sm ${
          useLayoutVersion 
            ? "bg-green-50 border border-green-100 text-green-800" 
            : "bg-blue-50 border border-blue-100 text-blue-800"
        }`}>
          <h3 className="font-medium mb-2">How {useLayoutVersion ? 'useLayoutEffect' : 'useEffect'} Works:</h3>
          <ol className="list-decimal list-inside space-y-1">
            {useLayoutVersion ? (
              <>
                <li>React renders component (DOM updates prepared)</li>
                <li><strong>useLayoutEffect runs synchronously</strong></li>
                <li>Browser paints the screen</li>
                <li>useEffect runs asynchronously</li>
              </>
            ) : (
              <>
                <li>React renders component (DOM updates prepared)</li>
                <li>Browser paints the screen</li>
                <li><strong>useEffect runs asynchronously</strong></li>
                <li>Screen may repaint if useEffect changes state</li>
              </>
            )}
          </ol>
        </div>
        
        {/* Toggle button */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={toggleDemo} 
            className={`
              px-6 py-2 font-medium rounded-lg shadow-md transition-all duration-200
              transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${useLayoutVersion 
                ? "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400" 
                : "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400"
              }
            `}
          >
            Switch to {useLayoutVersion ? "useEffect" : "useLayoutEffect"}
          </button>
        </div>
        
        {/* Recommendation note */}
        <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-3 text-sm text-amber-800">
          <p><strong>Best Practice:</strong> Use <code className="bg-amber-100 px-1 rounded">useLayoutEffect</code> only when UI changes must happen before paint, such as:</p>
          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
            <li>Preventing visual flickering</li>
            <li>Measuring DOM elements before display</li>
            <li>Critical layout calculations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleLayoutExample;