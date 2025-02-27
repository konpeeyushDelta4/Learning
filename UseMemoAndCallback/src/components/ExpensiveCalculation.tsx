import React from 'react'

interface ExpensiveCalculationProps {
    count: number;
}

console.time("ExpensiveCalculation");

const ExpensiveCalculation: React.FC<ExpensiveCalculationProps> = React.memo(({count}) => {
    console.log("Expensive calculation running...");

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

console.timeEnd("ExpensiveCalculation");


export default ExpensiveCalculation