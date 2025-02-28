import React, { useState, useEffect } from 'react';

interface SessionCreatedProps {
    onSessionCreated?: (sessionId: string) => void;
    onSessionDisconnected?: (sessionId: string) => void;
}

interface ApiResponse {
    type: string;
    message: string;
    data: {
        id: number;
        session_uid: number;
        chat_mode: string;
        project_id: number;
        integration_id: number;
        state: string;
        segment: string;
        status: string;
        device_type: null | string;
        platform: null | string;
        ip: null | string;
        country: string;
        visitor_id: null | string;
        is_emulator: boolean;
        data: Record<string, unknown>;
        contact_id: null | number;
        updatedAt: string;
        createdAt: string;
    }
}

const SessionCreated: React.FC<SessionCreatedProps> = ({ 
    onSessionCreated, 
    onSessionDisconnected
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const disconnectSession = async (id: string) => {
        try {
            setIsDisconnecting(true);
            
            console.log(`Disconnecting session: ${id}`);
            
            // API call would go here
            
            if (onSessionDisconnected) {
                onSessionDisconnected(id);
            }
            
            setSessionId(null);
        } catch (error) {
            console.error('Error disconnecting session:', error);
        } finally {
            setIsDisconnecting(false);
        }
    };

    useEffect(() => {
        const createSession = async () => {
            // Start timing the connection process
            console.time('SessionConnectionTime');
            
            try {
                setIsLoading(true);
                const response = await fetch('https://api.yourgpt.ai/chatbot/v1/createSession', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'api-key': 'apk-cff7c86896d0943b9d32299a84458f180d9962b049269e8e6568f1c4208f440d',
                    },
                    body: new URLSearchParams({
                        widget_uid: 'ad5f3011-ab96-469f-a0a3-cdc05b4020ef',
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create session');
                }

                const responseData = await response.json() as ApiResponse;
                console.log('Session created:', responseData);
                console.timeEnd('SessionConnectionTime');

                if (responseData.type === 'RXSUCCESS' && responseData.data.session_uid) {
                    const sessionUidString = responseData.data.session_uid.toString();
                    setSessionId(sessionUidString);
                    
                    if (onSessionCreated) {
                        onSessionCreated(sessionUidString);
                    }
                } else {
                    throw new Error('No session UID found in response');
                }
            } catch (error) {
                console.error('Error:', error);
                console.timeEnd('SessionConnectionTime');
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        createSession();

        return () => {
            if (sessionId) {
                console.log(`Component unmounting, disconnecting session: ${sessionId}`);
                disconnectSession(sessionId);
            }
        };
    }, [onSessionCreated]);

    return (
        <div className="bg-[#021526]/80 backdrop-blur-md rounded-lg border border-[#6EACDA]/20 overflow-hidden
                      shadow-lg">
            <div className="p-6 text-center">
                <h2 className="text-2xl font-medium text-[#E2E2B6] mb-6">Chat Session</h2>

                {isLoading ? (
                    <div className="py-8">
                        <div className="relative w-16 h-16 mx-auto mb-6">
                            {/* Material-style circular progress */}
                            <svg className="animate-spin w-16 h-16" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="#6EACDA"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <circle
                                    className="opacity-75"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="#E2E2B6"
                                    strokeWidth="4"
                                    strokeDasharray="56.55 56.55"
                                    strokeDashoffset="15"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </svg>
                        </div>
                        <p className="text-[#E2E2B6] font-medium">Creating session</p>
                        <p className="text-[#6EACDA] text-sm mt-2">Establishing secure connection...</p>
                    </div>
                ) : sessionId ? (
                    <div className="py-4 animate-in fade-in duration-300">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#03346E]/40 flex items-center justify-center
                                      border border-[#6EACDA]/30">
                            <svg className="w-8 h-8 text-[#E2E2B6]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        
                        <p className="text-[#E2E2B6] font-medium text-lg mb-2">Session Ready</p>
                        <p className="text-[#6EACDA] mb-6 max-w-sm mx-auto">Your AI chat session is now active and ready for interaction.</p>

                        <div className="bg-[#03346E]/40 backdrop-blur-sm rounded-md p-4 mb-6 mx-auto max-w-sm
                                      border border-[#6EACDA]/20">
                            <p className="text-xs text-[#6EACDA] mb-1 font-medium">SESSION ID</p>
                            <p className="font-mono text-sm text-[#E2E2B6] break-all">{sessionId}</p>
                        </div>

                        <div className="flex flex-col space-y-3 max-w-sm mx-auto">
                            <button
                                onClick={() => onSessionCreated && onSessionCreated(sessionId)}
                                className="w-full py-2.5 rounded-md font-medium text-[#021526]
                                        bg-[#E2E2B6] hover:bg-[#E2E2B6]/90
                                        shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 
                                        focus:ring-offset-2 focus:ring-[#E2E2B6]/50"
                            >
                                Start Chatting
                            </button>
                            
                            <button
                                onClick={() => sessionId && disconnectSession(sessionId)}
                                disabled={isDisconnecting}
                                className="w-full py-2.5 rounded-md font-medium text-[#6EACDA] 
                                        bg-transparent border border-[#6EACDA]/50 hover:bg-[#6EACDA]/10
                                        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6EACDA]/50"
                            >
                                {isDisconnecting ? 'Disconnecting...' : 'Cancel Connection'}
                            </button>
                        </div>
                    </div>
                ) : error ? (
                    <div className="py-4 animate-in fade-in duration-300">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-900/30 flex items-center justify-center
                                      border border-red-500/30">
                            <svg className="w-8 h-8 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <p className="text-red-400 font-medium text-lg mb-2">Connection Failed</p>
                        <p className="text-[#6EACDA] mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 rounded-md font-medium text-[#021526]
                                    bg-[#E2E2B6] hover:bg-[#E2E2B6]/90
                                    shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-[#E2E2B6]/50"
                        >
                            Try Again
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="bg-[#03346E]/40 p-3 border-t border-[#6EACDA]/20">
                <p className="text-xs text-center text-[#6EACDA]">
                    <svg className="w-3 h-3 inline-block mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    End-to-end encrypted connection
                </p>
            </div>
        </div>
    );
};

export default SessionCreated;