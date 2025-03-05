import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Suggestions } from '../components';
import { SuggestionProps } from '../types';


interface ImprovedSuggestionsProps {
    isVisible: boolean;
    position: { top: number; left: number };
    filteredSuggestions: SuggestionProps[];
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    selectSuggestion: (suggestion: SuggestionProps) => void;
    editorRef?: React.RefObject<HTMLDivElement | null>;
}

const ImprovedSuggestions: React.FC<ImprovedSuggestionsProps> = ({
    isVisible,
    position,
    filteredSuggestions,
    selectedIndex,
    setSelectedIndex,
    selectSuggestion,
    editorRef
}) => {
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);

    // Calculate proper position relative to the viewport
    useEffect(() => {
        if (!isVisible || !suggestionsRef.current || !editorRef?.current) return;

        // Get editor position
        const editorRect = editorRef.current.getBoundingClientRect();

        // Position based on cursor coordinates, but convert to viewport-relative
        const suggestionsEl = suggestionsRef.current;
        const cursorX = editorRect.left + position.left;
        const cursorY = editorRect.top + position.top;

        // Calculate available space and adjust position if needed
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const suggestionsHeight = Math.min(384, filteredSuggestions.length * 65 + 100); // Approximate height
        const suggestionsWidth = 380;

        // Check if we need to position above cursor instead of below (if near bottom of viewport)
        const willOverflowBottom = cursorY + suggestionsHeight > viewportHeight - 20;
        const willOverflowRight = cursorX + suggestionsWidth > viewportWidth - 20;

        // Set final position with scroll offsets
        suggestionsEl.style.top = `${cursorY + window.scrollY + (willOverflowBottom ? -suggestionsHeight : 8)}px`;
        suggestionsEl.style.left = `${willOverflowRight ? (cursorX + window.scrollX - suggestionsWidth + 100) : cursorX + window.scrollX}px`;
        suggestionsEl.style.maxHeight = `${Math.min(384, viewportHeight - 40)}px`;
        suggestionsEl.style.width = `380px`;

    }, [isVisible, position, editorRef, filteredSuggestions.length]);


    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <div
            ref={suggestionsRef}
            className="fixed z-[9999]"
        >
            <div className="bg-white rounded-lg overflow-hidden border border-gray-300 suggestions-no-blur">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Template Functions</h3>
                    <p className="text-xs text-gray-500">Select a template to insert</p>
                </div>

                <div
                    ref={listContainerRef}
                    className="suggestions-list-container max-h-96 overflow-y-auto"
                >
                    <Suggestions
                        filteredSuggestions={filteredSuggestions}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        selectSuggestion={selectSuggestion}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ImprovedSuggestions;