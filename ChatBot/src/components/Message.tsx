import React from 'react';
import YourGPTLogo from './YourGPTLogo';

export interface Choice {
  label: string;
  icon: string;
  value: string;
  selected: boolean;
}

export interface MessageProps {
  id: string | number;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date | string;
  choices?: Choice[];
  onChoiceSelected?: (value: string) => void;
  isPending?: boolean;
}

const Message: React.FC<MessageProps> = ({
  sender,
  text,
  timestamp,
  choices,
  onChoiceSelected,
  isPending
}) => {
  // Format timestamp string
  const formattedTime = typeof timestamp === 'string' 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (sender === 'assistant') {
    return (
      <div className="flex mb-4 animate-in fade-in duration-300">
        <div className="w-8 h-8 rounded-full bg-[#6EACDA] flex items-center justify-center text-[#021526] mr-3 flex-shrink-0">
          <YourGPTLogo size={18} color="#021526" />
        </div>
        <div className="bg-[#03346E]/60 rounded-lg rounded-tl-none p-3 max-w-[80%] 
                    border border-[#6EACDA]/30">
          {isPending ? (
            <div className="flex items-center space-x-2 py-1 text-[#E2E2B6]">
              <div className="w-2 h-2 rounded-full bg-[#E2E2B6] opacity-75 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-[#E2E2B6] opacity-75 animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-[#E2E2B6] opacity-75 animate-pulse delay-300"></div>
            </div>
          ) : (
            <>
              <p className="text-[#E2E2B6] whitespace-pre-wrap">{text}</p>
              {choices && choices.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {choices.map((choice) => (
                    <button
                      key={choice.value}
                      onClick={() => onChoiceSelected && onChoiceSelected(choice.value)}
                      className={`px-3 py-1.5 rounded-full text-sm flex items-center
                               bg-[#021526]/40 border border-[#6EACDA]/30 hover:bg-[#6EACDA]/20
                               transition-colors focus:outline-none focus:ring-2 focus:ring-[#E2E2B6]/50
                               ${choice.selected ? 'bg-[#E2E2B6]/20 border-[#E2E2B6]/40' : ''}`}
                    >
                      {choice.icon && <span className="mr-1.5">{choice.icon}</span>}
                      {choice.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-[#6EACDA]/70 mt-2 text-right">{formattedTime}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse mb-4 animate-in fade-in duration-300">
      <div className="w-8 h-8 rounded-full bg-[#E2E2B6] flex items-center justify-center text-[#021526] ml-3 flex-shrink-0">
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div className="bg-[#E2E2B6]/20 rounded-lg rounded-tr-none p-3 max-w-[80%] 
                    border border-[#E2E2B6]/20">
        <p className="text-[#E2E2B6] whitespace-pre-wrap">{text}</p>
        <p className="text-xs text-[#6EACDA]/70 mt-2 text-right">{formattedTime}</p>
      </div>
    </div>
  );
};

export default Message;