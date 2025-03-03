import React from 'react';
import { Link } from 'react-router-dom';

interface HookInfo {
  name: string;
  path: string;
  description: string;
  emoji: string;
}

const Home: React.FC = () => {
  const hooks: HookInfo[] = [
    {
      name: 'useMemo',
      path: '/memo',
      description: 'Memoize expensive calculations to optimize performance',
      emoji: '🧠'
    },
    {
      name: 'useCallback',
      path: '/callback',
      description: 'Memoize functions to prevent unnecessary re-renders',
      emoji: '🔄'
    },
    {
      name: 'useContext',
      path: '/context',
      description: 'Share data across components without prop-drilling',
      emoji: '🌐'
    },
    {
      name: 'useReducer',
      path: '/reducer',
      description: 'Manage complex state logic in a predictable way',
      emoji: '⚙️'
    },
    {
      name: 'useRef',
      path: '/ref',
      description: 'Access DOM elements and persist values between renders',
      emoji: '📌'
    },
    {
      name: 'useLayoutEffect',
      path: '/layout',
      description: 'Similar to useEffect, but fires before the browser paints',
      emoji: '🎨'
    },
    {
      name:'useActionState',
      path:'/useActionState',
      description:'Manage async actions with loading, error, and data states',
      emoji:'⚡'
    },
    {
      name:'useOptimistic',
      path:'/useOptimistic',
      description:'Optimistically update UI before async actions complete',
      emoji:'🚀'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">React Hooks Examples</h1>
        <p className="text-xl text-gray-600">
          Interactive examples to help you understand React Hooks
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {hooks.map((hook) => (
          <Link 
            key={hook.path} 
            to={hook.path}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-400"
          >
            <div className="flex items-start">
              <div className="text-4xl mr-4">{hook.emoji}</div>
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-2">{hook.name}</h2>
                <p className="text-gray-600">{hook.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Why React Hooks?</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Use state and other React features without writing classes</li>
          <li>Reuse stateful logic between components</li>
          <li>Organize related code together instead of splitting across lifecycle methods</li>
          <li>Avoid complex patterns like render props and higher-order components</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;