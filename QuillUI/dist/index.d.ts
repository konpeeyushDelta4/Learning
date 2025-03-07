import Quill from 'quill';

type ToolbarConfig = Array<string[] | {
    [key: string]: any;
}[]>;
type UseQuillProps = {
    theme?: 'snow' | 'bubble';
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    readOnly?: boolean;
    fontSize?: string;
    lineHeight?: string;
    width?: string;
    height?: string;
    toolbar?: boolean | ToolbarConfig;
    formats?: string[];
    onChange?: (content: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
};
type UseQuillReturn = {
    quillRef: React.RefObject<HTMLDivElement>;
    quillInstance: Quill | null;
    editorState: string;
    setEditorState: (content: string) => void;
    clearContent: () => void;
    focus: () => void;
    blur: () => void;
};
declare const useQuill: ({ theme, placeholder, value, defaultValue, readOnly, fontSize, lineHeight, width, height, toolbar, formats, onChange, onFocus, onBlur }?: UseQuillProps) => UseQuillReturn;

export { UseQuillProps, UseQuillReturn, useQuill };
