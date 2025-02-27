import React, { useState, useCallback } from "react";

interface ButtonProps {
  handleClick: () => void;
  name: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

/**
 * Button component wrapped in React.memo to prevent unnecessary re-renders
 * Using Tailwind CSS for styling
 */
const Button: React.FC<ButtonProps> = React.memo(({ handleClick, name, disabled = false, variant = "primary" }) => {
  console.log(`${name} button rendered`);

  // Tailwind class mapping based on variant
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300",
    secondary: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-300",
    danger: "bg-red-500 hover:bg-red-600 focus:ring-red-300",
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md text-white font-medium
        ${variantClasses[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        transition duration-200 ease-in-out
        shadow-sm hover:shadow-md transform hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
    >
      {name}
    </button>
  );
});

// Adding displayName helps with debugging in React DevTools
Button.displayName = "Button";

interface ExpensiveCalculationProps {
  count: number;
}

const ExpensiveCalculation: React.FC<ExpensiveCalculationProps> = React.memo(({ count }) => {
  console.log("Expensive calculation running...");

  // Simulate expensive operation
  let i = 0;
  while (i < 1000000000) i++;

  return (
    <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-amber-800 mb-2">Expensive Calculation</h3>
      <p className="text-amber-700">This calculation is expensive and should only run when needed.</p>
      <div className="mt-3 p-3 bg-white rounded-md shadow-sm text-xl font-bold text-center text-amber-900">
        Result: {count}
      </div>
    </div>
  );
});

const Callback: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [toggle, setToggle] = useState<boolean>(false);

  // Without useCallback - this function will be recreated on every render
  const incrementWithoutCallback = () => {
    setCount((prevCount) => prevCount + 1);
  };

  // With useCallback - this function will only be recreated if dependencies change
  const incrementWithCallback = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  // useCallback with dependencies - recreates when dependencies change
  const incrementByFive = useCallback(() => {
    setCount((prevCount) => prevCount + 5);
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">useCallback Hook Example</h2>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700">
          This example demonstrates how <code className="bg-blue-100 px-1 rounded">useCallback</code> prevents 
          unnecessary re-renders of memoized components by preserving function references.
        </p>
      </div>
      
      <div className="flex justify-center items-center mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800 mb-1">{count}</div>
          <div className="text-gray-500">Current Count</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 my-6">
        <Button handleClick={incrementWithoutCallback} name="Regular Button (No Callback)" />
        <Button handleClick={incrementWithCallback} name="Optimized Button (useCallback)" variant="primary" />
        <Button handleClick={incrementByFive} name="Increment by 5" variant="secondary" />
        <Button 
          handleClick={() => setToggle(!toggle)} 
          name={`Toggle: ${toggle ? "ON" : "OFF"}`} 
          variant="danger" 
        />
      </div>

      <div className="mb-6 p-5 bg-indigo-50 border border-indigo-200 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">What's happening?</h3>
        <ul className="list-disc list-inside space-y-2 text-indigo-700">
          <li>
            Each time the component renders, <code className="bg-indigo-100 px-1 rounded">incrementWithoutCallback</code> is recreated
          </li>
          <li>
            But <code className="bg-indigo-100 px-1 rounded">incrementWithCallback</code> is memoized and only created once
          </li>
          <li>
            The Toggle button creates a new inline function on every render
          </li>
          <li>
            Open your browser's console to see which buttons re-render when toggle changes
          </li>
        </ul>
      </div>

      <div className={`p-4 rounded-lg transition-colors ${toggle ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <span className="font-medium">Toggle State:</span>
          <span className={`px-3 py-1 rounded-full text-white font-medium ${toggle ? 'bg-green-500' : 'bg-gray-500'}`}>
            {toggle ? 'ON' : 'OFF'}
          </span>
        </div>
        <p className="text-sm mt-2 text-gray-600">
          This toggle state causes re-renders. Watch which buttons re-render in the console.
        </p>
      </div>

      <ExpensiveCalculation count={count} />
    </div>
  );
};

export default Callback;