import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from 'lexical';


import TemplateSuggestions from "./editor/TemplateSuggestions";

// Enhanced theme with improved Tailwind classes
const theme = {
    // Text formatting
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
        subscript: 'text-xs align-sub',
        superscript: 'text-xs align-super',
    },
    // Paragraph formatting with better spacing
    paragraph: 'mb-3 leading-relaxed',
    // Headings with improved typography
    heading: {
        h1: 'text-4xl font-bold my-6 text-gray-800',
        h2: 'text-3xl font-bold my-5 text-gray-800',
        h3: 'text-2xl font-bold my-4 text-gray-800',
        h4: 'text-xl font-bold my-3 text-gray-800',
        h5: 'text-lg font-bold my-2 text-gray-800',
    },
    // Lists with better styling
    list: {
        nested: {
            listitem: 'ml-6'
        },
        ol: 'list-decimal ml-6 my-4 space-y-1',
        ul: 'list-disc ml-6 my-4 space-y-1',
        listitem: 'mb-1 pl-1'
    },
    // Quote with more distinctive styling
    quote: 'pl-5 border-l-4 border-blue-400 italic my-4 text-gray-600',
    // Links with better hover effect
    link: 'text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors',
    // Code blocks with better syntax highlighting preparation
    code: 'bg-gray-50 p-3 rounded-md font-mono text-sm my-4 border border-gray-200 overflow-auto',
};

// Function to handle editor changes
const onChange = (editorState: EditorState) => {
    editorState.read(() => {
        // You can save the editor content here
    });
};

const RichTextEditor: React.FC = () => {
    // Initial editor configuration
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError: (error: Error) => {
            console.error('Lexical Editor Error:', error);
        },
        nodes: [
            HeadingNode,
            QuoteNode,
            ListItemNode,
            ListNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode
        ]
    };

    return (
        <div className="w-full max-w-5xl mx-auto my-8 px-4 sm:px-0">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                {/* Editor Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Dynamic Prompt Editor</h2>
                    <p className="text-sm text-gray-600 mt-1">Search wide varity of dataset</p>
                </div>

                <LexicalComposer initialConfig={initialConfig}>

                    {/* Editor Content Area with enhanced styling */}
                    <div className="px-6 py-5 bg-white">
                        <div className="bg-white rounded-lg relative">
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable
                                        className="min-h-[200px]  outline-none py-4 px-0 prose prose-blue max-w-none focus:outline-none text-gray-800"
                                        aria-label="Editor content"
                                        spellCheck={true}
                                        autoCorrect="on"
                                    />
                                }
                                placeholder={
                                    <div className="absolute top-4 left-0 text-gray-400 pointer-events-none">
                                        Start writing your content here...
                                    </div>
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <TemplateSuggestions/>
                        </div>
                    </div>

                    {/* Editor Status Bar */}
                    <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                        <div>Document Editor</div>
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
                                Saved
                            </span>
                        </div>
                    </div>

                    {/* Essential Plugins */}
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <OnChangePlugin onChange={onChange} />
                </LexicalComposer>
            </div>
        </div>
    );
};

export default RichTextEditor;