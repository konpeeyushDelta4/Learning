import Quill from "quill";
export interface UseQuillProps {
    theme?: 'snow' | 'bubble';
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    readOnly?: boolean;
    fontSize?: string;
    lineHeight?: string;
    width?: string;
    height?: string;
    toolbar?: boolean | string[][];
    formats?: string[];
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
