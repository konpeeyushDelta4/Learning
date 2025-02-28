'use client';

import React, { useState } from 'react';

const ClientCounter = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="border rounded-lg p-4 bg-white">
            <p className="mb-3">
                This is a <strong>Client Component</strong> with interactivity.
                The counter state is managed client-side:
            </p>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setCount(count - 1)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    -
                </button>

                <span className="text-xl font-bold">{count}</span>

                <button
                    onClick={() => setCount(count + 1)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default ClientCounter;