'use client'; // Mark this explicitly as a client component

import React, { Suspense, useState } from 'react';
import {ClientCounter, TodoList} from './components';
// Import the client wrapper instead of the server component directly


const App = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">React Server Components Demo</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-blue-800">
          This demo shows how Server and Client Components work together.
          Server Components are rendered on the server and streamed to the client.
          Client Components handle interactivity.
        </p>
      </div>
      
      {/* Client Component with interactivity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Client Component Example</h2>
        <ClientCounter />
      </div>
      
      {/* Filter controls (Client-side interactivity) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Server Component with Client Filter</h2>
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* Server Component wrapped in Suspense */}
      <Suspense fallback={<div className="animate-pulse h-40 bg-gray-100 rounded-lg"></div>}>
        <TodoList filter={filter} />
      </Suspense>
    </div>
  );
};

export default App;