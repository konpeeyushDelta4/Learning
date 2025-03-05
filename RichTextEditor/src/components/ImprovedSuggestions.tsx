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

    // Auto-scroll to keep the selected item visible - improved version
    useEffect(() => {
        if (!isVisible || !listContainerRef.current) return;

        // Use a small delay to ensure the DOM has updated
        const scrollTimer = setTimeout(() => {
            // Make sure container ref is still valid inside this callback
            const container = listContainerRef.current;
            if (!container) return; // Early return if null

            // Find the selected item by data attribute
            const selectedItem = container.querySelector(`.suggestion-item[data-index="${selectedIndex}"]`);
            if (!selectedItem) return;

            const containerRect = container.getBoundingClientRect();
            const selectedRect = selectedItem.getBoundingClientRect();

            // Check if selected item is outside view
            if (selectedRect.bottom > containerRect.bottom) {
                // Item is below the visible area - scroll down
                container.scrollTop += (selectedRect.bottom - containerRect.bottom) + 8;
            } else if (selectedRect.top < containerRect.top) {
                // Item is above the visible area - scroll up
                container.scrollTop -= (containerRect.top - selectedRect.top) + 8;
            }
        }, 50); // Small delay to ensure rendering has completed

        return () => clearTimeout(scrollTimer);
    }, [selectedIndex, isVisible]);

    if (!isVisible) return null;

    return ReactDOM.createPortal(
        <div
            ref={suggestionsRef}
            className="suggestions-wrapper fixed z-[9999]"
            style={{
                maxWidth: 'calc(100% - 32px)',
                filter: 'none',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.12)',
                isolation: 'isolate',
            }}
        >
            <div className="bg-white rounded-lg overflow-hidden border border-gray-300 suggestions-no-blur">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Template Functions</h3>
                    <p className="text-xs text-gray-500">Select a template to insert</p>
                </div>

                {/* Add ref to the scrollable container */}
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