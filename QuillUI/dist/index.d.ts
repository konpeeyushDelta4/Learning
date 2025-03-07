import Quill from 'quill';
import React$1 from 'react';

type ToolbarConfig = Array<string[] | {
    [key: string]: any;
}[]>;
type useDynamicTextEditorProps = {
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
type useDynamicTextEditorReturn = {
    quillRef: React.RefObject<HTMLDivElement>;
    quillInstance: Quill | null;
    editorState: string;
    setEditorState: (content: string) => void;
    clearContent: () => void;
    focus: () => void;
    blur: () => void;
};
declare const useDynamicTextEditor: ({ theme, placeholder, value, defaultValue, readOnly, fontSize, lineHeight, width, height, toolbar, formats, onChange, onFocus, onBlur }?: useDynamicTextEditorProps) => useDynamicTextEditorReturn;

interface DynamicTextEditorProps extends Omit<useDynamicTextEditorProps, "ref"> {
    className?: string;
    containerClassName?: string;
    editorClassName?: string;
}
type DynamicTextEditorRef = {
    quillInstance: ReturnType<typeof useDynamicTextEditor>["quillInstance"];
    editorState: string;
    setEditorState: (content: string) => void;
    clearContent: () => void;
    focus: () => void;
    blur: () => void;
    containerRef: HTMLDivElement | null;
};
declare const DynamicTextEditor: React$1.ForwardRefExoticComponent<DynamicTextEditorProps & React$1.RefAttributes<DynamicTextEditorRef>>;

export { DynamicTextEditor, DynamicTextEditorProps, DynamicTextEditorRef, useDynamicTextEditor, useDynamicTextEditorProps };
