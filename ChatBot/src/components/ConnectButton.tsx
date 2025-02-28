import React, { useState } from 'react';

interface ConnectButtonProps {
    onConnect: () => Promise<void>;
    className?: string;
    label?: string;
    loadingLabel?: string;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
    onConnect,
    className = '',
    label = 'Connect to Session',
    loadingLabel = 'Connecting...'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await onConnect();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect');
            console.error('Connection error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const baseClasses = "relative px-5 py-2.5 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    const defaultClasses = "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg";

    return (
        <div className="inline-block">
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`${baseClasses} ${className || defaultClasses} ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
            >
                <div className="flex items-center justify-center">
                    {isLoading && (
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isLoading ? loadingLabel : label}
                </div>
            </button>

            {error && (
                <div className="mt-2 text-sm text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ConnectButton;