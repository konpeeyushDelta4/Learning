import { useMemo, useState } from "react";

const Memo = () => {
  const [counterOne, setCounterOne] = useState<number>(0);
  const [counterTwo, setCounterTwo] = useState<number>(0);

  const incrementOne = (): void => {
    setCounterOne(counterOne + 1);
  };

  const incrementTwo = (): void => {
    setCounterTwo(counterTwo + 1);
  };

  // Expensive operation with memoization
  const isEvenMemo = useMemo<boolean>(() => {
    console.log("....waiting");
    let i = 0;
    while (i < 2000000000) i++;
    return counterOne % 2 === 0;
  }, [counterOne]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">useMemo Hook Example</h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700">
          <strong>useMemo</strong> memoizes expensive calculations so they only recompute when dependencies change. Notice how incrementing Counter Two remains fast while Counter One triggers the
          expensive calculation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Counter One Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-3">Counter One</h2>
          <p className="text-sm text-green-600 mb-4">This counter triggers the expensive calculation</p>

          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-green-700 mb-4">{counterOne}</span>
            <button
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={incrementOne}
            >
              Increment One
            </button>
          </div>

          <div className="mt-6 p-3 bg-white bg-opacity-70 rounded-lg">
            <p className="text-center font-medium">
              Is <span className="text-green-700 font-bold">{counterOne}</span> even?{" "}
              <span className={`font-bold ${isEvenMemo ? "text-indigo-600" : "text-pink-600"}`}>{isEvenMemo ? "Even ✓" : "Odd ✗"}</span>
            </p>
          </div>
        </div>

        {/* Counter Two Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">Counter Two</h2>
          <p className="text-sm text-blue-600 mb-4">This counter is independent of the calculation</p>

          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-blue-700 mb-4">{counterTwo}</span>
            <button
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={incrementTwo}
            >
              Increment Two
            </button>
          </div>

          <div className="mt-6 p-3 bg-white bg-opacity-70 rounded-lg">
            <p className="text-center">This counter doesn't trigger the expensive calculation, so it updates quickly.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h3 className="font-semibold text-amber-800 mb-2">How useMemo Works:</h3>
        <ul className="list-disc list-inside space-y-1 text-amber-700">
          <li>
            The expensive calculation is wrapped in <code className="bg-amber-100 px-1 rounded">useMemo</code>
          </li>
          <li>
            It only recalculates when <code className="bg-amber-100 px-1 rounded">counterOne</code> changes
          </li>
          <li>
            When <code className="bg-amber-100 px-1 rounded">counterTwo</code> changes, the calculation is skipped
          </li>
          <li>Try toggling between the counters to feel the difference!</li>
        </ul>
      </div>
    </div>
  );
};

export default Memo;
