'use strict';

var React = require('react');
var Quill = require('quill');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * A customizable rich text editor component based on Quill.js
 */
var Editor = React.forwardRef(function (props, ref) {
    var 
    // Instance props
    id = props.id, _a = props.className, className = _a === void 0 ? "" : _a, style = props.style, 
    // Content props
    value = props.value, defaultValue = props.defaultValue, _b = props.placeholder, placeholder = _b === void 0 ? "Write something..." : _b, _c = props.readOnly, readOnly = _c === void 0 ? false : _c, 
    // Dimension props
    _d = props.height, 
    // Dimension props
    height = _d === void 0 ? "auto" : _d, _e = props.width, width = _e === void 0 ? "100%" : _e, maxHeight = props.maxHeight, _f = props.minHeight, minHeight = _f === void 0 ? "150px" : _f, 
    // Toolbar and module props
    _g = props.toolbar, 
    // Toolbar and module props
    toolbar = _g === void 0 ? true : _g, _h = props.modules, modules = _h === void 0 ? {} : _h, formats = props.formats, _j = props.theme, theme = _j === void 0 ? "snow" : _j, 
    // Event handlers
    onChange = props.onChange, onChangeSelection = props.onChangeSelection, onFocus = props.onFocus, onBlur = props.onBlur, onReady = props.onReady, 
    // Children
    children = props.children, rest = __rest(props, ["id", "className", "style", "value", "defaultValue", "placeholder", "readOnly", "height", "width", "maxHeight", "minHeight", "toolbar", "modules", "formats", "theme", "onChange", "onChangeSelection", "onFocus", "onBlur", "onReady", "children"]);
    // Refs
    var editorRef = React.useRef(null);
    var quillInstanceRef = React.useRef(null);
    // State
    var _k = React.useState(false); _k[0]; var setEditorReady = _k[1];
    // Forward the ref to the parent component if provided
    React.useImperativeHandle(ref, function () { return editorRef.current; });
    // Initialize Quill
    React.useEffect(function () {
        if (!editorRef.current || quillInstanceRef.current)
            return;
        // Configure toolbar
        var toolbarOptions = toolbar === true
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
        var quillModules = __assign({ toolbar: toolbarOptions }, modules);
        // Initialize Quill
        var quill = new Quill(editorRef.current, {
            modules: quillModules,
            placeholder: placeholder,
            readOnly: readOnly,
            theme: theme === null ? undefined : theme,
            formats: formats,
        });
        // Set initial content
        if (defaultValue && !value) {
            quill.clipboard.dangerouslyPasteHTML(defaultValue);
        }
        else if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }
        // Store handlers for cleanup
        var textChangeHandler;
        var selectionChangeHandler;
        // Set up event handlers
        if (onChange) {
            textChangeHandler = function (delta, oldDelta, source) {
                onChange(quill.root.innerHTML, delta, source, quill);
            };
            quill.on("text-change", textChangeHandler);
        }
        if (onChangeSelection) {
            selectionChangeHandler = function (range, oldRange, source) {
                onChangeSelection(range, source, quill);
            };
            quill.on("selection-change", selectionChangeHandler);
        }
        if (onFocus) {
            quill.root.addEventListener("focus", function () { return onFocus(quill); });
        }
        if (onBlur) {
            quill.root.addEventListener("blur", function () { return onBlur(quill); });
        }
        // Store the Quill instance
        quillInstanceRef.current = quill;
        setEditorReady(true);
        // Call onReady with the Quill instance
        if (onReady) {
            onReady(quill);
        }
        // Clean up
        return function () {
            if (onChange && textChangeHandler) {
                quill.off("text-change", textChangeHandler);
            }
            if (onChangeSelection && selectionChangeHandler) {
                quill.off("selection-change", selectionChangeHandler);
            }
            if (onFocus) {
                quill.root.removeEventListener("focus", function () { return onFocus(quill); });
            }
            if (onBlur) {
                quill.root.removeEventListener("blur", function () { return onBlur(quill); });
            }
            // quillInstanceRef.current = null;
        };
    }, [defaultValue, onChange, onChangeSelection, onFocus, onBlur, onReady, placeholder, readOnly, theme, formats, modules]);
    // Update content when value changes (controlled component)
    React.useEffect(function () {
        if (quillInstanceRef.current && value !== undefined && value !== quillInstanceRef.current.root.innerHTML) {
            quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value);
        }
    }, [value]);
    // Determine editor className
    var editorClassName = "quill-ui-editor ".concat(theme ? "theme-".concat(theme) : "", " ").concat(readOnly ? "read-only" : "", " ").concat(className);
    return (React.createElement("div", __assign({ id: id, className: editorClassName, style: __assign({ height: height, width: width, maxHeight: maxHeight, minHeight: minHeight }, style) }, rest),
        React.createElement("div", { ref: editorRef }),
        children));
});
Editor.displayName = "Editor";

/**
 * A customizable toolbar component for the Quill editor
 */
var Toolbar = React.forwardRef(function (props, ref) {
    var id = props.id, _a = props.className, className = _a === void 0 ? "" : _a, style = props.style; props.options; var _b = props.position, position = _b === void 0 ? "top" : _b, _c = props.sticky, sticky = _c === void 0 ? false : _c, _d = props.disabled, disabled = _d === void 0 ? false : _d, rest = __rest(props, ["id", "className", "style", "options", "position", "sticky", "disabled"]);
    // Generate the toolbar ID
    var toolbarId = id || "quill-ui-toolbar-".concat(Math.random().toString(36).substr(2, 9));
    // Build className
    var toolbarClassName = [
        "quill-ui-toolbar",
        position === "bottom" ? "quill-ui-toolbar-bottom" : "quill-ui-toolbar-top",
        sticky ? "quill-ui-toolbar-sticky" : "",
        disabled ? "quill-ui-toolbar-disabled" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return React.createElement("div", __assign({ id: toolbarId, ref: ref, className: toolbarClassName, style: style }, rest));
});
Toolbar.displayName = "Toolbar";

/**
 * A component for displaying structured content within the editor
 */
var ContentBlock = React.forwardRef(function (props, ref) {
    var id = props.id, _a = props.className, className = _a === void 0 ? "" : _a, style = props.style, children = props.children, _b = props.contentEditable, contentEditable = _b === void 0 ? false : _b, dangerouslySetInnerHTML = props.dangerouslySetInnerHTML, rest = __rest(props, ["id", "className", "style", "children", "contentEditable", "dangerouslySetInnerHTML"]);
    // Build className
    var blockClassName = ["quill-ui-content-block", contentEditable ? "quill-ui-content-block-editable" : "", className].filter(Boolean).join(" ");
    return (React.createElement("div", __assign({ id: id, ref: ref, className: blockClassName, style: style, contentEditable: contentEditable, dangerouslySetInnerHTML: dangerouslySetInnerHTML }, rest), !dangerouslySetInnerHTML && children));
});
ContentBlock.displayName = "ContentBlock";

exports.ContentBlock = ContentBlock;
exports.Editor = Editor;
exports.Toolbar = Toolbar;
//# sourceMappingURL=index.js.map
