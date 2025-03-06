import { CSSProperties, ReactNode } from 'react';
import Quill from 'quill';
/**
 * Base Editor Props interface
 */
export interface EditorProps {
    id?: string;
    className?: string;
    style?: CSSProperties;
    ref?: React.Ref<HTMLDivElement>;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    height?: string | number;
    width?: string | number;
    maxHeight?: string | number;
    minHeight?: string | number;
    toolbar?: boolean | string[] | {
        container: string | string[] | object;
    };
    modules?: Record<string, any>;
    formats?: string[];
    theme?: 'snow' | 'bubble' | null;
    onChange?: (html: string, delta: any, source: string, editor: Quill) => void;
    onChangeSelection?: (range: any, source: string, editor: Quill) => void;
    onFocus?: (editor: Quill) => void;
    onBlur?: (editor: Quill) => void;
    onReady?: (editor: Quill) => void;
    children?: ReactNode;
}
/**
 * Toolbar Props interface
 */
export interface ToolbarProps {
    id?: string;
    className?: string;
    style?: CSSProperties;
    options?: string[] | {
        container: string | string[] | object;
    };
    position?: 'top' | 'bottom';
    sticky?: boolean;
    disabled?: boolean;
}
/**
 * ContentBlock Props interface
 */
export interface ContentBlockProps {
    id?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    contentEditable?: boolean;
    dangerouslySetInnerHTML?: {
        __html: string;
    };
}
