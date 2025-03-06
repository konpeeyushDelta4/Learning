import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { defaultSuggestions } from '../../utils/constants';
import { TemplateSuggestion, UseRegexProps, Position } from '../../types';

// Interface to track the last inserted template
interface LastInsertedTemplate {
    index: number;
    length: number;
}

// Interface to track template positions
interface TemplatePosition {
    start: number;
    end: number;
}

const useRegex = ({ quillInstance }: UseRegexProps) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [searchText, setSearchText] = useState('');
    const [triggerIndex, setTriggerIndex] = useState<number | null>(null);

    // Ref to track the last inserted template
    const lastInsertedTemplate = useRef<LastInsertedTemplate | null>(null);

    // Ref to track all template positions in the document
    const templatePositions = useRef<{ [key: number]: TemplatePosition }>({});

    // Add ref for suggestions container
    const suggestionsRef = useRef<HTMLDivElement | null>(null);

    const filteredSuggestions = useMemo(() => defaultSuggestions.filter(suggestion =>
        suggestion.label.toLowerCase().includes(searchText.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(searchText.toLowerCase())
    ), [searchText]);

    // Add scroll helper function
    const scrollSelectedIntoView = useCallback((index: number) => {
        // Find the suggestion item by its data-index attribute
        const selectedItem = document.querySelector(`[data-index="${index}"]`) as HTMLElement;

        if (selectedItem) {
            // Use basic scrollIntoView for simplicity
            selectedItem.scrollIntoView({ block: 'nearest' });
        }
    }, []);

    /**
     * Scan the document for all templates and store their positions
     */
    const scanForTemplates = useCallback(() => {
        if (!quillInstance) return;

        const text = quillInstance.getText();
        const positions: { [key: number]: TemplatePosition } = {};

        let startPos = -1;
        let openBrackets = 0;

        // Scan through the text character by character
        for (let i = 0; i < text.length - 1; i++) {
            // Check for opening brackets
            if (text[i] === '{' && text[i + 1] === '{') {
                if (openBrackets === 0) {
                    startPos = i;
                }
                openBrackets++;
                i++; // Skip the next character since we've already checked it
            }
            // Check for closing brackets
            else if (text[i] === '}' && text[i + 1] === '}') {
                openBrackets--;
                if (openBrackets === 0 && startPos !== -1) {
                    // We've found a complete template
                    const endPos = i + 2; // Include both closing brackets

                    // Store the template position with its content as the key
                    for (let pos = startPos; pos < endPos; pos++) {
                        positions[pos] = { start: startPos, end: endPos };
                    }

                    startPos = -1;
                }
                i++; // Skip the next character
            }
        }

        templatePositions.current = positions;
    }, [quillInstance]);

    /**
     * Check if the cursor is inside a template
     */
    const isInsideTemplate = useCallback((cursorPos: number) => {
        return templatePositions.current[cursorPos] !== undefined;
    }, []);

    /**
     * Get the template boundaries at the cursor position
     */
    const getTemplateBoundaries = useCallback((cursorPos: number) => {
        return templatePositions.current[cursorPos];
    }, []);

    // Check for the '{{' pattern in text and show suggestions
    const checkForTriggerPattern = useCallback(() => {
        if (!quillInstance) return;

        const selection = quillInstance.getSelection();
        if (!selection) return;

        const cursorPosition = selection.index;
        const text = quillInstance.getText(0, cursorPosition);

        // Check for '{{' pattern before cursor
        const triggerPos = text.lastIndexOf('{{');

        // If we found a trigger pattern and it's close to the cursor
        if (triggerPos !== -1 && triggerPos < cursorPosition && triggerPos >= cursorPosition - 50) {
            // Get any text between '{{' and cursor for filtering
            const query = text.substring(triggerPos + 2);

            // Update search text
            setSearchText(query);

            // Update trigger index
            setTriggerIndex(triggerPos);

            // Get the proper position based on cursor location
            const bounds = quillInstance.getBounds(triggerPos);

            if (bounds) {
                // Only update position if it has changed significantly or if suggestions aren't shown yet
                const newPosition = {
                    top: bounds.top + bounds.height,
                    left: bounds.left
                };

                // Only update position when suggestions first appear or on significant change
                if (!showSuggestions ||
                    !position ||
                    Math.abs(position.top - newPosition.top) > 20 ||
                    Math.abs(position.left - newPosition.left) > 20) {
                    setPosition(newPosition);
                }
            }

            // Show suggestions
            setShowSuggestions(true);

            // Only reset selection index if it's not already set
            if (selectedIndex === -1) {
                setSelectedIndex(0);
            }
        } else {
            // Only hide suggestions if they're currently shown
            if (showSuggestions) {
                setShowSuggestions(false);
                setSelectedIndex(-1); // Reset selection when hiding suggestions
                setTriggerIndex(null);
            }
        }

        // Scan for templates whenever we check for trigger patterns
        scanForTemplates();
    }, [quillInstance, position, showSuggestions, selectedIndex, scanForTemplates]);

    // Now define insertSuggestion after checkForTriggerPattern
    const insertSuggestion = useCallback((suggestion: TemplateSuggestion) => {
        if (!quillInstance || triggerIndex === null) return;

        const selection = quillInstance.getSelection();
        if (!selection) return;

        // Calculate the deletion length (from '{{' to cursor)
        const deleteLength = selection.index - triggerIndex;

        // Delete the trigger text and any search text
        quillInstance.deleteText(triggerIndex, deleteLength);

        // Insert the template with the template-variable format
        const template = `{{${suggestion.label}}}`;
        quillInstance.insertText(triggerIndex, template, { 'template-variable': true });

        // Save reference to this template
        lastInsertedTemplate.current = {
            index: triggerIndex,
            length: template.length
        };

        // Move cursor after inserted template
        quillInstance.setSelection(triggerIndex + template.length, 0);

        // Reset state
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setTriggerIndex(null);
        setSearchText('');

        // Force a check for new templates after a short delay
        // This helps detect a new template if the user types one immediately
        setTimeout(() => {
            checkForTriggerPattern();
        }, 100);
    }, [quillInstance, triggerIndex, checkForTriggerPattern]);

    // Use a throttled version of checkForTriggerPattern to prevent rapid updates
    const lastRunRef = useRef(0);

    const throttledCheckForTriggerPattern = useCallback(() => {
        const now = Date.now();
        // Run immediately if it's been more than 100ms since last run
        if (now - lastRunRef.current >= 100) {
            checkForTriggerPattern();
            lastRunRef.current = now;
        } else {
            // Otherwise schedule to run after a short delay
            setTimeout(() => {
                checkForTriggerPattern();
                lastRunRef.current = Date.now();
            }, 10);
        }
    }, [checkForTriggerPattern]);

    // Monitor text changes to detect trigger pattern
    useEffect(() => {
        if (!quillInstance) return;

        const handleTextChange = () => {
            throttledCheckForTriggerPattern();
            // Also scan for templates on text change
            scanForTemplates();
        };

        quillInstance.on('text-change', handleTextChange);

        return () => {
            quillInstance.off('text-change', handleTextChange);
        };
    }, [quillInstance, throttledCheckForTriggerPattern, scanForTemplates]);

    // Monitor selection changes
    useEffect(() => {
        if (!quillInstance) return;

        const handleSelectionChange = () => {
            throttledCheckForTriggerPattern();
        };

        quillInstance.on('selection-change', handleSelectionChange);

        return () => {
            quillInstance.off('selection-change', handleSelectionChange);
        };
    }, [quillInstance, throttledCheckForTriggerPattern]);

    // Handle backspace key press to delete entire templates
    const handleBackspace = useCallback((e: KeyboardEvent) => {
        if (!quillInstance || e.key !== 'Backspace') return;

        const selection = quillInstance.getSelection();
        if (!selection) return;

        const cursorPos = selection.index;

        // Check if we're inside a template
        if (isInsideTemplate(cursorPos)) {
            // Get the template boundaries
            const boundaries = getTemplateBoundaries(cursorPos);
            if (!boundaries) return;

            // Prevent default backspace behavior
            e.preventDefault();
            e.stopPropagation();

            // Delete the entire template
            quillInstance.deleteText(boundaries.start, boundaries.end - boundaries.start);

            // Position cursor at the start position
            quillInstance.setSelection(boundaries.start, 0);

            // Rescan for templates after deletion
            setTimeout(() => {
                scanForTemplates();
            }, 10);
        }
    }, [quillInstance, isInsideTemplate, getTemplateBoundaries, scanForTemplates]);

    // Modify the keyboard handler to preserve cursor position during navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Handle backspace for template deletion
        if (e.key === 'Backspace') {
            handleBackspace(e);
            return;
        }

        // Handle space key for resetting format
        if (e.key === ' ' && quillInstance && lastInsertedTemplate.current) {
            // No need to reset the format, usePaint will handle it
            lastInsertedTemplate.current = null;
        }

        // Only handle keyboard navigation if suggestions are shown and we have suggestions
        if (showSuggestions && filteredSuggestions.length > 0) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedIndex(prev => {
                        const newIndex = Math.min(prev + 1, filteredSuggestions.length - 1);
                        scrollSelectedIntoView(newIndex);
                        return newIndex;
                    });

                    // Preserve cursor position after navigation
                    if (quillInstance && triggerIndex !== null) {
                        // Small delay to ensure the editor doesn't lose focus
                        setTimeout(() => {
                            const currentSelection = quillInstance.getSelection();
                            if (currentSelection) {
                                quillInstance.setSelection(currentSelection);
                            }
                        }, 0);
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedIndex(prev => {
                        const newIndex = Math.max(prev - 1, 0);
                        scrollSelectedIntoView(newIndex);
                        return newIndex;
                    });

                    // Preserve cursor position after navigation
                    if (quillInstance && triggerIndex !== null) {
                        // Small delay to ensure the editor doesn't lose focus
                        setTimeout(() => {
                            const currentSelection = quillInstance.getSelection();
                            if (currentSelection) {
                                quillInstance.setSelection(currentSelection);
                            }
                        }, 0);
                    }
                    break;

                case 'Enter':
                    e.preventDefault();
                    e.stopPropagation();
                    if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
                        insertSuggestion(filteredSuggestions[selectedIndex]);
                    }
                    break;

                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSuggestions(false);

                    // Ensure editor keeps focus after closing suggestions
                    if (quillInstance) {
                        quillInstance.focus();
                    }
                    break;

                case 'Tab':
                    e.preventDefault();
                    e.stopPropagation();
                    if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
                        insertSuggestion(filteredSuggestions[selectedIndex]);
                    }
                    break;
            }
        }
    }, [showSuggestions, filteredSuggestions, selectedIndex, insertSuggestion, quillInstance, scrollSelectedIntoView, triggerIndex, handleBackspace]);

    // Add keyboard event listener - modified to always listen for keydown to detect space
    useEffect(() => {
        // Initial scan for templates
        scanForTemplates();

        // Always listen for keydown to detect space after template insertion and handle navigation
        document.addEventListener('keydown', handleKeyDown, true);

        // Add the focus trap only when suggestions are shown
        if (showSuggestions) {
            const preventFocusChange = (e: FocusEvent) => {
                if (quillInstance && quillInstance.root !== e.target) {
                    e.preventDefault();
                    quillInstance.focus();
                }
            };
            document.addEventListener('focusin', preventFocusChange, true);

            // When suggestions are shown, make sure the first item is selected
            if (filteredSuggestions.length > 0 && selectedIndex === -1) {
                setSelectedIndex(0);
            }

            return () => {
                document.removeEventListener('keydown', handleKeyDown, true);
                document.removeEventListener('focusin', preventFocusChange, true);
            };
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [handleKeyDown, showSuggestions, quillInstance, filteredSuggestions, selectedIndex, scanForTemplates]);

    // Define selectSuggestion last since it depends on insertSuggestion
    const selectSuggestion = useCallback((suggestion: TemplateSuggestion) => {
        insertSuggestion(suggestion);
    }, [insertSuggestion]);

    return {
        showSuggestions,
        position,
        filteredSuggestions,
        selectedIndex,
        setSelectedIndex,
        selectSuggestion,
        suggestionsRef,
    };
};

export default useRegex;