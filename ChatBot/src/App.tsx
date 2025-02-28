import React, { useState, useRef, useEffect } from 'react';
import SessionCreated from './components/SessionCreated';
import ConnectButton from './components/ConnectButton';
import YourGPTLogo from './components/YourGPTLogo';
import Message, { MessageProps } from './components/Message';

interface ApiResponse {
  type: string;
  message: string;
  data: {
    id: number;
    session_id: number;
    send_by: string;
    response_source: string;
    message: string;
    content_type: string;
    choices?: {
      label: string;
      icon: string;
      value: string;
      selected: boolean;
    }[];
    type: number;
    delivered: string;
    createdAt: string;
  };
}

const App: React.FC = () => {
  const [showSessionCreator, setShowSessionCreator] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const API_KEY = "apk-cff7c86896d0943b9d32299a84458f180d9962b049269e8e6568f1c4208f440d";
  const WIDGET_UID = "ad5f3011-ab96-469f-a0a3-cdc05b4020ef";

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConnect = async () => {
    setShowSessionCreator(true);
  };

  const handleSessionCreated = (newSessionId: string) => {
    setSessionId(newSessionId);
    setShowSessionCreator(false);
    console.log(`App: Session connected with ID: ${newSessionId}`);

    // Add welcome message
    setMessages([{
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    }]);
  };

  const handleSessionDisconnected = (sessionId: string) => {
    console.log(`App: Session disconnected with ID: ${sessionId}`);
    setSessionId(null);
    setMessages([]);
  };

  const handleChoiceSelected = async (messageId: string | number, choiceValue: string) => {
    // Update the UI to show the selected choice
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.choices) {
        return {
          ...msg,
          choices: msg.choices.map(choice => ({
            ...choice,
            selected: choice.value === choiceValue
          }))
        };
      }
      return msg;
    }));

    // Here you could also send this feedback to your API
    console.log(`Choice selected: ${choiceValue} for message ${messageId}`);
  };

  const sendMessage = async (text: string) => {
    if (!sessionId || !text.trim()) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    // Add user message to the chat
    const userMessage: MessageProps = {
      id: userMessageId,
      sender: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Add placeholder for assistant response
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      sender: 'assistant',
      text: '',
      timestamp: new Date(),
      isPending: true,
    }]);

    setIsTyping(true);

    try {
      const response = await fetch('https://api.yourgpt.ai/chatbot/v1/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'api-key': API_KEY,
        },
        body: new URLSearchParams({
          'widget_uid': WIDGET_UID,
          'session_uid': sessionId,
          'message': text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as ApiResponse;

      if (data.type !== 'RXSUCCESS') {
        throw new Error('Failed to get response from AI');
      }

      // Replace the placeholder with the actual message
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? {
            id: data.data.id,
            sender: 'assistant',
            text: data.data.message,
            timestamp: data.data.createdAt,
            choices: data.data.choices,
            isPending: false,
            onChoiceSelected: (value) => handleChoiceSelected(data.data.id, value),
          }
          : msg
      ));

      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);

      // Update the error message
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? {
            ...msg,
            text: "Sorry, I couldn't process your message. Please try again.",
            isPending: false,
          }
          : msg
      ));

      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const text = messageText;
      setMessageText("");
      sendMessage(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Custom scrollbar style */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(3, 52, 110, 0.2);
          border-radius: 4px;
          margin: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(110, 172, 218, 0.5);
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(226, 226, 182, 0.6);
        }

        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(110, 172, 218, 0.5) rgba(3, 52, 110, 0.2);
        }

        /* When the scrollbar is inactive, make it more subtle */
        .custom-scrollbar:not(:hover)::-webkit-scrollbar-thumb {
          background: rgba(110, 172, 218, 0.3);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#021526] to-[#03346E] p-6 sm:p-8">
        {/* Glass morphism background elements */}
        <div className="fixed top-0 left-0 right-0 h-[300px] bg-[#6EACDA]/10 backdrop-blur-[100px] -z-10"></div>
        <div className="fixed top-1/2 left-1/4 w-32 h-32 rounded-full bg-[#E2E2B6]/5 blur-3xl -z-10"></div>
        <div className="fixed top-1/3 right-1/4 w-40 h-40 rounded-full bg-[#6EACDA]/10 blur-3xl -z-10"></div>

        <div className="max-w-3xl mx-auto">
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center mb-4">
              <YourGPTLogo size={48} color="#E2E2B6" className="mr-3 drop-shadow-lg" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#E2E2B6]">yourGPT</h1>
            </div>
            <div className="h-[2px] w-24 bg-[#6EACDA]/50 mx-auto rounded-full mb-3"></div>
            <p className="text-[#6EACDA] text-lg">Advanced AI Chat Assistant</p>
          </header>

          {!showSessionCreator && !sessionId && (
            <div className="bg-[#021526]/80 backdrop-blur-md rounded-lg border border-[#6EACDA]/20 
                          shadow-lg p-8 mb-8 animate-in fade-in duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-6 rounded-full bg-[#03346E]/40 flex items-center justify-center
                              border border-[#6EACDA]/30">
                  <svg className="w-8 h-8 text-[#E2E2B6]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="10" r="1"></circle>
                    <circle cx="8" cy="10" r="1"></circle>
                    <circle cx="16" cy="10" r="1"></circle>
                  </svg>
                </div>

                <h2 className="text-xl font-medium text-[#E2E2B6] mb-2">Welcome to AI Chat</h2>
                <p className="text-[#6EACDA] mb-8 max-w-md">
                  Experience intelligent conversations powered by advanced language models. Connect to start your session.
                </p>

                <ConnectButton
                  onConnect={handleConnect}
                  label="Create New Session"
                  loadingLabel="Initializing..."
                  className="px-6 py-2.5 rounded-md font-medium text-[#021526]
                           bg-[#E2E2B6] hover:bg-[#E2E2B6]/90
                           shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-[#E2E2B6]/50"
                />
              </div>
            </div>
          )}

          {showSessionCreator && (
            <div className="animate-in fade-in duration-300">
              <SessionCreated
                onSessionCreated={handleSessionCreated}
                onSessionDisconnected={handleSessionDisconnected}
              />
            </div>
          )}

          {sessionId && (
            <div className="bg-[#021526]/80 backdrop-blur-md rounded-lg border border-[#6EACDA]/20 
                          shadow-lg overflow-hidden animate-in fade-in duration-300">
              <div className="border-b border-[#6EACDA]/20">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <YourGPTLogo size={24} color="#E2E2B6" className="mr-2" />
                    <div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[#E2E2B6] mr-2"></div>
                        <h2 className="text-lg font-medium text-[#E2E2B6]">Active Session</h2>
                      </div>
                      <p className="text-sm text-[#6EACDA] mt-1 pl-4 font-mono">
                        {sessionId}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSessionDisconnected(sessionId)}
                    className="p-2 rounded-md text-sm text-[#6EACDA] hover:bg-[#03346E]/40
                             focus:outline-none focus:ring-2 focus:ring-[#6EACDA]/50 transition-colors"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18"></path>
                      <path d="M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Message area with logo in the corner */}
                <div
                  ref={messageContainerRef}
                  className="custom-scrollbar relative min-h-[300px] max-h-[60vh] mb-4 p-4 rounded-md 
                            bg-[#03346E]/40 border border-[#6EACDA]/20 overflow-y-auto"
                >
                  {/* Small logo watermark */}
                  <div className="absolute top-3 right-3 opacity-10 pointer-events-none">
                    <YourGPTLogo size={60} color="#E2E2B6" />
                  </div>

                  {messages.map((message) => (
                    <Message
                      key={message.id}
                      {...message}
                    />
                  ))}

                  {error && (
                    <div className="py-2 px-3 bg-red-900/30 border border-red-500/30 rounded-md text-[#E2E2B6] text-sm my-4">
                      Error: {error}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message input with improved send button */}
                <div className="relative flex items-center bg-[#03346E]/40 border border-[#6EACDA]/20 rounded-md overflow-hidden">
                  <textarea
                    placeholder="Type your message..."
                    className="flex-grow p-3 pr-14 bg-transparent resize-none min-h-[52px] max-h-32
                            placeholder-[#6EACDA]/50 text-[#E2E2B6]
                            focus:outline-none focus:ring-0 focus:border-0"
                    rows={1}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                  ></textarea>
                  <div className="absolute right-2 bottom-[6px]">
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || isTyping}
                      className="p-2 rounded-full bg-[#E2E2B6] text-[#021526] hover:bg-[#E2E2B6]/90
                               transition-colors shadow-md
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                               focus:outline-none focus:ring-2 focus:ring-[#E2E2B6]/50"
                      aria-label="Send message"
                    >
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {isTyping && (
                  <div className="text-[#6EACDA] text-xs mt-2">
                    <svg className="inline-block w-3 h-3 mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v2"></path>
                    </svg>
                    AI is thinking...
                  </div>
                )}
              </div>

              <div className="px-4 py-2 border-t border-[#6EACDA]/20 flex items-center justify-center text-[#6EACDA]/60 text-xs">
                <YourGPTLogo size={14} color="#6EACDA" className="mr-1 opacity-70" />
                <span>yourGPT AI Assistant • Powered by AI</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;