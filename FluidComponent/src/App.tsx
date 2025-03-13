import React from 'react'
import Navbar from './components/ui/Navbar'

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Fluid UI Components</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold mb-4">Component {i + 1}</h2>
              <p className="text-gray-300">
                This is a sample component card that demonstrates the layout.
                Your actual components would go here.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Navbar */}
      <Navbar />
    </div>
  )
}

export default App