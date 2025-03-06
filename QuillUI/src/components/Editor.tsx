import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import Quill from "quill";
import { EditorProps } from "../types";

// Import Quill styles
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "../styles/editor.css";

export interface QuillInstance extends Quill {}

/**
 * A customizable rich text editor component based on Quill.js
 */
const Editor = forwardRef<HTMLDivElement, EditorProps>((props, ref) => {
  const {
    // Instance props
    id,
    className = "",
    style,

    // Content props
    value,
    defaultValue,
    placeholder = "Write something...",
    readOnly = false,

    // Dimension props
    height = "auto",
    width = "100%",
    maxHeight,
    minHeight = "150px",

    // Toolbar and module props
    toolbar = true,
    modules = {},
    formats,
    theme = "snow",

    // Event handlers
    onChange,
    onChangeSelection,
    onFocus,
    onBlur,
    onReady,

    // Children
    children,

    ...rest
  } = props;

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

  // State
  const [editorReady, setEditorReady] = useState(false);

  // Forward the ref to the parent component if provided
  useImperativeHandle(ref, () => editorRef.current as HTMLDivElement);

  // Initialize Quill
  useEffect(() => {
    if (!editorRef.current || quillInstanceRef.current) return;

    // Configure toolbar
    let toolbarOptions =
      toolbar === true
        ? [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
          ]
        : toolbar;

    // Configure modules
    const quillModules = {
      toolbar: toolbarOptions,
      ...modules,
    };

    // Initialize Quill
    const quill = new Quill(editorRef.current, {
      modules: quillModules,
      placeholder,
      readOnly,
      theme: theme === null ? undefined : theme,
      formats: formats,
    });

    // Set initial content
    if (defaultValue && !value) {
      quill.clipboard.dangerouslyPasteHTML(defaultValue);
    } else if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    // Store handlers for cleanup
    let textChangeHandler: any;
    let selectionChangeHandler: any;

    // Set up event handlers
    if (onChange) {
      textChangeHandler = (delta: any, oldDelta: any, source: string) => {
        onChange(quill.root.innerHTML, delta, source, quill);
      };
      quill.on("text-change", textChangeHandler);
    }

    if (onChangeSelection) {
      selectionChangeHandler = (range: any, oldRange: any, source: string) => {
        onChangeSelection(range, source, quill);
      };
      quill.on("selection-change", selectionChangeHandler);
    }

    if (onFocus) {
      quill.root.addEventListener("focus", () => onFocus(quill));
    }

    if (onBlur) {
      quill.root.addEventListener("blur", () => onBlur(quill));
    }

    // Store the Quill instance
    quillInstanceRef.current = quill;
    setEditorReady(true);

    // Call onReady with the Quill instance
    if (onReady) {
      onReady(quill);
    }

    // Clean up
    return () => {
      if (onChange && textChangeHandler) {
        quill.off("text-change", textChangeHandler);
      }
      if (onChangeSelection && selectionChangeHandler) {
        quill.off("selection-change", selectionChangeHandler);
      }
      if (onFocus) {
        quill.root.removeEventListener("focus", () => onFocus(quill));
      }
      if (onBlur) {
        quill.root.removeEventListener("blur", () => onBlur(quill));
      }
      // quillInstanceRef.current = null;
    };
  }, [defaultValue, onChange, onChangeSelection, onFocus, onBlur, onReady, placeholder, readOnly, theme, formats, modules]);

  // Update content when value changes (controlled component)
  useEffect(() => {
    if (quillInstanceRef.current && value !== undefined && value !== quillInstanceRef.current.root.innerHTML) {
      quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value]);

  // Determine editor className
  const editorClassName = `quill-ui-editor ${theme ? `theme-${theme}` : ""} ${readOnly ? "read-only" : ""} ${className}`;

  return (
    <div
      id={id}
      className={editorClassName}
      style={{
        height,
        width,
        maxHeight,
        minHeight,
        ...style,
      }}
      {...rest}
    >
      <div ref={editorRef} />
      {children}
    </div>
  );
});

Editor.displayName = "Editor";

export default Editor;
