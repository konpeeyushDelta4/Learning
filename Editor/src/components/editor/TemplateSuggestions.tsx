import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    TextNode,
    $getSelection,
    $isRangeSelection,
    $createTextNode,
    $getNodeByKey,
} from 'lexical';

import { defaultSuggestions, TemplateSuggestion } from '../../utils/constants';

const TemplateSuggestions: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [triggeredNodeKey, setTriggeredNodeKey] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');

    // Filter templates based on search text
    const filteredTemplates = defaultSuggestions.filter(template =>
        template.label.toLowerCase().includes(searchText.toLowerCase()) ||
        template.description.toLowerCase().includes(searchText.toLowerCase())
    );

    // Check for {{ pattern and show suggestions
    const checkForTemplateTrigger = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
                setShowSuggestions(false);
                return;
            }

            const node = selection.getNodes()[0];
            if (!node || !(node instanceof TextNode)) {
                setShowSuggestions(false);
                return;
            }

            const textContent = node.getTextContent();
            const selectionOffset = selection.anchor.offset;

            // Check if user just typed '{{'
            if (
                selectionOffset >= 2 &&
                textContent.substring(selectionOffset - 2, selectionOffset) === '{{'
            ) {
                // Get node bounds for positioning the suggestions
                const domElement = editor.getElementByKey(node.getKey());
                if (domElement) {
                    const domSelection = window.getSelection();
                    if (domSelection && domSelection.rangeCount > 0) {
                        const range = domSelection.getRangeAt(0);
                        const rect = range.getBoundingClientRect();
                        const editorElem = editor.getRootElement();

                        if (editorElem) {
                            const editorRect = editorElem.getBoundingClientRect();

                            setPosition({
                                top: rect.bottom - editorRect.top,
                                left: rect.left - editorRect.left
                            });

                            setShowSuggestions(true);
                            setSelectedIndex(0);
                            setTriggeredNodeKey(node.getKey());
                            setSearchText('');
                        }
                    }
                }
            } else if (
                // Handle further typing after '{{' to filter suggestions
                textContent.includes('{{') &&
                selectionOffset > 2 &&
                textContent.substring(selectionOffset - 3, selectionOffset - 1) === '{{'
            ) {
                // Extract search text after '{{'
                const searchStart = textContent.lastIndexOf('{{', selectionOffset) + 2;
                const currentSearchText = textContent.substring(searchStart, selectionOffset);
                setSearchText(currentSearchText);
            } else {
                setShowSuggestions(false);
            }
        });
    }, [editor]);

    // Function to insert the selected template - FIXED
    const insertTemplate = useCallback((template: TemplateSuggestion) => {
        if (!triggeredNodeKey) return;

        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            // Get the current node
            const node = $getNodeByKey(triggeredNodeKey);
            if (node instanceof TextNode) {
                const textContent = node.getTextContent();
                const selectionOffset = selection.anchor.offset;

                // Find the position of the '{{' trigger
                const triggerPos = textContent.lastIndexOf('{{', selectionOffset);
                if (triggerPos !== -1) {
                    // Delete the '{{' and any characters after it up to the cursor
                    const beforeTrigger = textContent.substring(0, triggerPos);
                    const afterCursor = textContent.substring(selectionOffset);

                    // Replace the node's content with text before the trigger
                    node.setTextContent(beforeTrigger);

                    // Create a template node with the necessary content
                    const templateContent = `{{${template.label}}}`;
                    const templateNode = $createTextNode(templateContent);

                    // Insert the template node and add any text that was after the cursor
                    node.insertAfter(templateNode);

                    if (afterCursor) {
                        const afterNode = $createTextNode(afterCursor);
                        templateNode.insertAfter(afterNode);
                        afterNode.selectStart(); // Position cursor after the template
                    } else {
                        templateNode.selectEnd(); // Position cursor after the template
                    }
                }
            }
        });

        // Important: Close the suggestions after insertion
        setShowSuggestions(false);
    }, [editor, triggeredNodeKey]);

    // Modified keyboard handler to ensure enter key works properly
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!showSuggestions) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setSelectedIndex((prevIndex) =>
                    Math.min(prevIndex + 1, filteredTemplates.length - 1)
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
                break;
            case 'Enter':
                event.preventDefault();
                event.stopPropagation(); // Stop propagation to prevent other handlers from stealing the event
                if (filteredTemplates.length > 0 && selectedIndex >= 0) {
                    insertTemplate(filteredTemplates[selectedIndex]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    }, [showSuggestions, selectedIndex, filteredTemplates, insertTemplate]);

    // Set up event listeners - FIXED to use capture phase for keydown
    useEffect(() => {
        // Using capture to ensure our handler gets the event first
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [handleKeyDown]);

    // Register updates listener to detect '{{' trigger
    useEffect(() => {
        return editor.registerUpdateListener(() => {
            checkForTemplateTrigger();
        });
    }, [editor, checkForTemplateTrigger]);

    // IMPROVED styling transformer to ensure templates are correctly styled
    useEffect(() => {
        const decorationCleanupFns: Array<() => void> = [];

        const transformerCleanup = editor.registerNodeTransform(TextNode, (textNode) => {
            // Check if this node contains template markers
            const text = textNode.getTextContent();
            const templateRegex = /\{\{([^{}]+)\}\}/g;

            if (!templateRegex.test(text)) return;

            // Get the DOM element for this node
            const domElement = editor.getElementByKey(textNode.getKey());
            if (!domElement) return;

            // Add a custom attribute to mark this node for styling
            domElement.setAttribute('data-contains-templates', 'true');

            // Schedule styling to ensure the DOM is ready
            const rafId = requestAnimationFrame(() => {
                if (!domElement.isConnected) return;

                try {
                    // Find all template patterns
                    const matches = [...text.matchAll(templateRegex)];

                    // Create a new text content with styled templates
                    let newContent = '';
                    let lastIndex = 0;

                    // Process each match
                    for (const match of matches) {
                        const matchIndex = match.index || 0;
                        const templateName = match[1];
                        const template = defaultSuggestions.find(t => t.label === templateName);

                        if (!template) continue;

                        // Add text before this match
                        if (matchIndex > lastIndex) {
                            newContent += text.substring(lastIndex, matchIndex);
                        }

                        // Add styled span for the template
                        newContent += `<span class="template-tag" 
                                            data-id="${String(template.id)}" 
                                            data-description="${template.description}"
                                            style="color: rgb(37 99 235); 
                                            background-color: rgb(219 234 254); 
                                            padding: 2px 4px; 
                                            border-radius: 4px; 
                                            cursor: help;
                                            position: relative;
                                            z-index: 1;">
                                        ${match[0]}
                                    </span>`;

                        lastIndex = matchIndex + match[0].length;
                    }

                    // Add any remaining text
                    if (lastIndex < text.length) {
                        newContent += text.substring(lastIndex);
                    }

                    // Update the DOM element's innerHTML
                    if (newContent !== domElement.innerHTML) {
                        domElement.innerHTML = newContent;

                        // Add event listeners to all template tags
                        const templateTags = domElement.querySelectorAll('.template-tag');
                        templateTags.forEach(tag => {
                            // Add hover listener
                            tag.addEventListener('mouseenter', () => {
                                const description = tag.getAttribute('data-description');
                                if (!description) return;

                                const tooltip = document.createElement('div');
                                tooltip.className = 'template-tooltip';
                                tooltip.textContent = description;
                                tooltip.style.position = 'absolute';
                                tooltip.style.bottom = 'calc(100% + 8px)';
                                tooltip.style.left = '50%';
                                tooltip.style.transform = 'translateX(-50%)';
                                tooltip.style.backgroundColor = 'rgb(30 41 59)';
                                tooltip.style.color = 'white';
                                tooltip.style.padding = '6px 10px';
                                tooltip.style.borderRadius = '4px';
                                tooltip.style.fontSize = '12px';
                                tooltip.style.zIndex = '50';
                                tooltip.style.whiteSpace = 'nowrap';
                                tooltip.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';

                                // Add arrow
                                const arrow = document.createElement('div');
                                arrow.style.position = 'absolute';
                                arrow.style.top = '100%';
                                arrow.style.left = '50%';
                                arrow.style.transform = 'translateX(-50%)';
                                arrow.style.width = '0';
                                arrow.style.height = '0';
                                arrow.style.borderLeft = '6px solid transparent';
                                arrow.style.borderRight = '6px solid transparent';
                                arrow.style.borderTop = '6px solid rgb(30 41 59)';

                                tooltip.appendChild(arrow);
                                tag.appendChild(tooltip);
                            });

                            // Remove tooltip on mouse leave
                            tag.addEventListener('mouseleave', () => {
                                const tooltip = tag.querySelector('.template-tooltip');
                                if (tooltip) {
                                    tooltip.remove();
                                }
                            });
                        });
                    }
                } catch (error) {
                    console.error('Error applying template styling:', error);
                }
            });

            // Store cleanup function
            decorationCleanupFns.push(() => {
                cancelAnimationFrame(rafId);
                if (domElement.isConnected) {
                    domElement.removeAttribute('data-contains-templates');
                }
            });
        });

        // Return cleanup function
        return () => {
            decorationCleanupFns.forEach(cleanup => cleanup());
            transformerCleanup();
        };
    }, [editor]);

    if (!showSuggestions) {
        return null;
    }

    return (
        <div
            className="absolute z-10 bg-white rounded-md shadow-lg border border-gray-200 w-80 overflow-hidden"
            style={{ top: position.top + 5, left: position.left }}
        >
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Documentation Templates</h3>
                <p className="text-xs text-gray-500">Select a template to insert</p>
            </div>

            <ul className="max-h-64 overflow-y-auto">
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template, index) => (
                        <li
                            key={template.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 transition-colors duration-150 ${selectedIndex === index ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => insertTemplate(template)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className="font-medium text-sm text-gray-800">{template.label}</div>
                            <div className="text-xs text-gray-500">{template.description}</div>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-3 text-sm text-gray-500">No matching templates</li>
                )}
            </ul>

            <div className="p-2 flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
                <div>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-200 text-gray-800 mr-1">↑↓</span> Navigate
                </div>
                <div>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-200 text-gray-800 mr-1">Enter</span> Select
                </div>
                <div>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-200 text-gray-800 mr-1">Esc</span> Dismiss
                </div>
            </div>
        </div>
    );
};

export default TemplateSuggestions;