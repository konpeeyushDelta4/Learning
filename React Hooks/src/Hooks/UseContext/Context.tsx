import React, { createContext, useContext, useState } from "react";

// 1. Create a context with default values
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// 1. Creating the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// 2. Create a context provider component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // The value prop contains the context data that will be shared
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// 3. Create custom hook for cleaner consumption of context
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// 4. Create components that consume the context
const ThemedButton: React.FC = () => {
  // Using our custom hook to access the context
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className={`
        px-4 py-2 rounded-lg font-medium transform transition-all duration-300
        shadow hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${theme === "light" 
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:ring-blue-400" 
          : "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 focus:ring-yellow-300"}
      `}
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

const ThemedHeader: React.FC = () => {
  const { theme } = useTheme();

  return (
    <header 
      className={`
        p-5 rounded-lg shadow-md transition-all duration-300 ease-in-out
        ${theme === "light" 
          ? "bg-white text-gray-800 border border-gray-200" 
          : "bg-gray-800 text-white border border-gray-700"}
      `}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Theme Demo</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Current:</span>
          <span className={`
            px-3 py-1 rounded-full text-xs font-bold uppercase
            ${theme === "light" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-yellow-200 text-yellow-800"}
          `}>
            {theme} Mode
          </span>
        </div>
      </div>
    </header>
  );
};

// 5. Deep nested component that still has access to context
const DeepNestedComponent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div 
      className={`
        p-5 border rounded-lg shadow-sm transition-all duration-300 ease-in-out
        ${theme === "light" 
          ? "border-gray-300 bg-gray-50" 
          : "border-gray-600 bg-gray-700 text-gray-100"}
      `}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`
          h-8 w-8 rounded-full flex items-center justify-center
          ${theme === "light" ? "bg-blue-100" : "bg-gray-600"}
        `}>
          <svg className={`h-4 w-4 ${theme === "light" ? "text-blue-600" : "text-yellow-400"}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="font-semibold">Deeply Nested Component</h3>
      </div>
      <p className={`
        text-sm
        ${theme === "light" ? "text-gray-600" : "text-gray-300"}
      `}>
        This component is nested deeply in the tree, but can still access the theme 
        context directly without any props being passed down!
      </p>
    </div>
  );
};

// 6. Main component that wraps everything with the Provider
const Context: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="max-w-xl mx-auto">
        <div className="useContext-demo">
          <div className="space-y-6">
            <ThemedHeader />

            <section className="useContext-content">
              <div className="useTheme-example">
                <ThemedButton />
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Component Hierarchy</h3>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 text-blue-700 rounded">
                        <span className="font-medium">App (with ThemeProvider)</span>
                      </div>
                      <svg className="h-6 w-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <div className="p-3 bg-green-50 text-green-700 rounded">
                        <span className="font-medium">ThemedHeader</span>
                      </div>
                      <svg className="h-6 w-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <div className="p-3 bg-purple-50 text-purple-700 rounded">
                        <span className="font-medium">Nested Components...</span>
                      </div>
                      <svg className="h-6 w-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <DeepNestedComponent />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
              <h2 className="text-lg font-bold text-blue-800 mb-3">How useContext Works:</h2>
              <ol className="list-decimal list-inside space-y-3 mt-2">
                <li className="p-2 bg-white bg-opacity-60 rounded">
                  Create context with <code className="px-1 bg-blue-100 rounded text-blue-800">createContext</code>
                </li>
                <li className="p-2 bg-white bg-opacity-60 rounded">
                  Wrap components with <code className="px-1 bg-blue-100 rounded text-blue-800">Context.Provider</code>
                </li>
                <li className="p-2 bg-white bg-opacity-60 rounded">
                  Access context with <code className="px-1 bg-blue-100 rounded text-blue-800">useContext</code> hook
                </li>
                <li className="p-2 bg-white bg-opacity-60 rounded">
                  Or create a custom hook for cleaner access
                </li>
              </ol>
              
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">
                      useContext is perfect for data that many components need (theme, auth, language), 
                      but use sparingly to avoid unnecessary re-renders.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Context;