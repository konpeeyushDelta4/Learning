import { useState, useEffect, useCallback } from 'react';
import Quill from 'quill';
import { defaultSuggestions } from '../../utils/constants';

// Add proper typing for suggestions
interface TemplateSuggestion {
    id: string | number;
    label: string;
    description: string;
    category?: string;
    type?: string;
    link?: string;
    value?: string;
}

interface UseRegexProps {
    quillInstance: Quill | null;
}

interface Position {
    top: number;
    left: number;
}

const useRegex = ({ quillInstance }: UseRegexProps) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [triggerIndex, setTriggerIndex] = useState<number | null>(null);

    // Filter suggestions based on search text
    const filteredSuggestions = defaultSuggestions.filter(suggestion =>
        suggestion.label.toLowerCase().includes(searchText.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(searchText.toLowerCase())
    );

    // FIX: Define insertSuggestion first, before it's used by handleKeyDown
    const insertSuggestion = useCallback((suggestion: TemplateSuggestion) => {
        if (!quillInstance || triggerIndex === null) return;

        const selection = quillInstance.getSelection();
        if (!selection) return;

        // Calculate the deletion length (from '{{' to cursor)
        const deleteLength = selection.index - triggerIndex;

        // Delete the trigger text and any search text
        quillInstance.deleteText(triggerIndex, deleteLength);

        // Insert the template with styling
        const template = `{{${suggestion.label}}}`;

        // First insert plain text
        quillInstance.insertText(triggerIndex, template);

        // Then apply formatting to make it stand out
        quillInstance.formatText(triggerIndex, template.length, {
            'color': '#3b82f6',
            'background': '#dbeafe',
            'template': suggestion.id // Custom format for tracking templates
        });

        // Move cursor after inserted template
        quillInstance.setSelection(triggerIndex + template.length, 0);

        // Close suggestions
        setShowSuggestions(false);
    }, [quillInstance, triggerIndex]);

    // Now define handleKeyDown which uses insertSuggestion
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                e.stopPropagation();
                setSelectedIndex(prev =>
                    Math.min(prev + 1, filteredSuggestions.length - 1)
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                e.stopPropagation();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;

            // Add support for Home and End keys
            case 'Home':
                e.preventDefault();
                e.stopPropagation();
                setSelectedIndex(0); // Go to first item
                break;

            case 'End':
                e.preventDefault();
                e.stopPropagation();
                setSelectedIndex(filteredSuggestions.length - 1); // Go to last item
                break;

            case 'Enter':
                e.preventDefault();
                e.stopPropagation();
                if (filteredSuggestions.length > 0) {
                    insertSuggestion(filteredSuggestions[selectedIndex]);
                }
                break;

            case 'Escape':
                e.preventDefault();
                e.stopPropagation();
                setShowSuggestions(false);
                break;

            case 'Tab':
                if (showSuggestions) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (filteredSuggestions.length > 0) {
                        insertSuggestion(filteredSuggestions[selectedIndex]);
                    }
                }
                break;
        }
    }, [showSuggestions, filteredSuggestions, selectedIndex, insertSuggestion]);

    // Check for the '{{' pattern in text and show suggestions
    const checkForTriggerPattern = useCallback(() => {
        if (!quillInstance) return;

        const selection = quillInstance.getSelection();
        if (!selection) return;

        const cursorPosition = selection.index;
        const text = quillInstance.getText(0, cursorPosition);

        // Check for '{{' pattern before cursor
        const triggerPos = text.lastIndexOf('{{');

        if (triggerPos !== -1 && triggerPos >= cursorPosition - 20) {
            // Get any text between '{{' and cursor for filtering
            const query = text.substring(triggerPos + 2);
            setSearchText(query);
            setTriggerIndex(triggerPos);

            // Get the proper position based on cursor location
            const bounds = quillInstance.getBounds(triggerPos);

            if (bounds) {
                setPosition({
                    top: bounds.top + bounds.height,
                    left: bounds.left
                });
            } else {
                setPosition({
                    top: 10,
                    left: 10
                });
            }

            setShowSuggestions(true);
            setSelectedIndex(0);
        } else {
            setShowSuggestions(false);
            setTriggerIndex(null);
        }
    }, [quillInstance]);

    // Monitor text changes to detect trigger pattern
    useEffect(() => {
        if (!quillInstance) return;

        const handleTextChange = () => {
            checkForTriggerPattern();
        };

        quillInstance.on('text-change', handleTextChange);

        return () => {
            quillInstance.off('text-change', handleTextChange);
        };
    }, [quillInstance, checkForTriggerPattern]);

    // Monitor selection changes
    useEffect(() => {
        if (!quillInstance) return;

        const handleSelectionChange = () => {
            checkForTriggerPattern();
        };

        quillInstance.on('selection-change', handleSelectionChange);

        return () => {
            quillInstance.off('selection-change', handleSelectionChange);
        };
    }, [quillInstance, checkForTriggerPattern]);

    // Add keyboard event listener
    useEffect(() => {
        if (showSuggestions) {
            document.addEventListener('keydown', handleKeyDown, true);

            // Focus trap - prevent focus from leaving the editor while suggestions are shown
            const preventFocusChange = (e: FocusEvent) => {
                if (quillInstance && quillInstance.root !== e.target) {
                    e.preventDefault();
                    quillInstance.focus();
                }
            };

            document.addEventListener('focusin', preventFocusChange, true);

            return () => {
                document.removeEventListener('keydown', handleKeyDown, true);
                document.removeEventListener('focusin', preventFocusChange, true);
            };
        }
    }, [handleKeyDown, showSuggestions, quillInstance]);

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
        selectSuggestion
    };
};

export default useRegex;