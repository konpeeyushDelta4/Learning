import Quill from "quill";

export interface UseQuillProps {
    // Theme options
    theme?: 'snow' | 'bubble';

    // Content options
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    readOnly?: boolean;

    // Style options
    fontSize?: string;
    lineHeight?: string;
    width?: string;
    height?: string;

    // Toolbar and formatting options
    toolbar?: boolean | string[][];
    formats?: string[];

    // Event handlers
    onChange?: (content: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export interface UseQuillReturn {
    quillRef: React.RefObject<HTMLDivElement>;
    quillInstance: Quill | null;
    editorState: string;
    setEditorState: (content: string) => void;
    clearContent: () => void;
    focus: () => void;
    blur: () => void;
}
