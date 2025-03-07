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

var defaultToolbarOptions = [
    ['bold', 'italic', 'underline'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['clean']
];
var useDynamicTextEditor = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.theme, theme = _c === void 0 ? 'snow' : _c, _d = _b.placeholder, placeholder = _d === void 0 ? 'Write something...' : _d, value = _b.value, _e = _b.defaultValue, defaultValue = _e === void 0 ? '' : _e, _f = _b.readOnly, readOnly = _f === void 0 ? false : _f, _g = _b.fontSize, fontSize = _g === void 0 ? '1rem' : _g, _h = _b.lineHeight, lineHeight = _h === void 0 ? '1.5' : _h, _j = _b.width, width = _j === void 0 ? '100%' : _j, _k = _b.height, height = _k === void 0 ? 'auto' : _k, _l = _b.toolbar, toolbar = _l === void 0 ? true : _l, _m = _b.formats, formats = _m === void 0 ? [] : _m, onChange = _b.onChange, onFocus = _b.onFocus, onBlur = _b.onBlur;
    var containerRef = React.useRef(null);
    var _o = React.useState(null), quillInstance = _o[0], setQuillInstance = _o[1];
    var _p = React.useState(defaultValue), editorState = _p[0], setEditorState = _p[1];
    // Initialize Quill
    React.useEffect(function () {
        if (!containerRef.current || quillInstance)
            return;
        // Clear any existing content and create editor container
        containerRef.current.innerHTML = '<div class="editor-content"></div>';
        var editorElement = containerRef.current.querySelector('.editor-content');
        // Create Quill instance
        var quill = new Quill(editorElement, {
            theme: theme,
            placeholder: placeholder,
            readOnly: readOnly,
            modules: __assign(__assign({}, (toolbar !== false && {
                toolbar: toolbar === true ? defaultToolbarOptions : toolbar
            })), { history: {
                    userOnly: true
                } }),
            formats: formats.length > 0 ? formats : undefined
        });
        // Apply styles
        quill.root.style.fontSize = fontSize;
        quill.root.style.lineHeight = lineHeight;
        quill.root.style.width = width;
        quill.root.style.height = height;
        // Set initial content
        if (value !== undefined) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }
        else if (defaultValue) {
            quill.clipboard.dangerouslyPasteHTML(defaultValue);
        }
        // Save instance
        setQuillInstance(quill);
        // Listen for content changes
        var handleTextChange = function () {
            setEditorState(quill.root.innerHTML);
            onChange === null || onChange === void 0 ? void 0 : onChange(quill.root.innerHTML);
        };
        quill.on('text-change', handleTextChange);
        // Handle focus/blur
        var handleFocus = function () { return onFocus === null || onFocus === void 0 ? void 0 : onFocus(); };
        var handleBlur = function () { return onBlur === null || onBlur === void 0 ? void 0 : onBlur(); };
        quill.root.addEventListener('focus', handleFocus);
        quill.root.addEventListener('blur', handleBlur);
        // Clean up
        return function () {
            quill.off('text-change', handleTextChange);
            quill.root.removeEventListener('focus', handleFocus);
            quill.root.removeEventListener('blur', handleBlur);
            quill.disable();
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            setQuillInstance(null);
        };
    }, []);
    // Handle prop changes after initial mount
    React.useEffect(function () {
        if (!quillInstance)
            return;
        // Update styles
        quillInstance.root.style.fontSize = fontSize;
        quillInstance.root.style.lineHeight = lineHeight;
        quillInstance.root.style.width = width;
        quillInstance.root.style.height = height;
        // Update readOnly state
        quillInstance.enable(!readOnly);
        // Reinitialize Quill if toolbar changes
        if (toolbar !== undefined && containerRef.current) {
            var content = quillInstance.root.innerHTML;
            quillInstance.disable();
            containerRef.current.innerHTML = '<div class="editor-content"></div>';
            var editorElement = containerRef.current.querySelector('.editor-content');
            var newQuill = new Quill(editorElement, {
                theme: theme,
                placeholder: placeholder,
                readOnly: readOnly,
                modules: __assign(__assign({}, (toolbar !== false && {
                    toolbar: toolbar === true ? defaultToolbarOptions : toolbar
                })), { history: {
                        userOnly: true
                    } }),
                formats: formats.length > 0 ? formats : undefined
            });
            newQuill.clipboard.dangerouslyPasteHTML(content);
            setQuillInstance(newQuill);
        }
    }, [theme, fontSize, lineHeight, width, height, readOnly, toolbar]);
    // Handle value changes separately
    React.useEffect(function () {
        if (!quillInstance || value === undefined)
            return;
        if (value !== quillInstance.root.innerHTML) {
            quillInstance.clipboard.dangerouslyPasteHTML(value);
        }
    }, [value]);
    // Utility functions
    var clearContent = function () {
        if (quillInstance) {
            quillInstance.setText('');
        }
    };
    var focus = function () {
        quillInstance === null || quillInstance === void 0 ? void 0 : quillInstance.focus();
    };
    var blur = function () {
        if (quillInstance) {
            quillInstance.root.blur();
        }
    };
    return {
        quillRef: containerRef,
        quillInstance: quillInstance,
        editorState: editorState,
        setEditorState: function (content) {
            if (quillInstance) {
                quillInstance.clipboard.dangerouslyPasteHTML(content);
            }
        },
        clearContent: clearContent,
        focus: focus,
        blur: blur
    };
};

var DynamicTextEditorBase = function (_a, ref) {
    var _b = _a.className, className = _b === void 0 ? "" : _b, _c = _a.containerClassName, containerClassName = _c === void 0 ? "" : _c, _d = _a.editorClassName, editorClassName = _d === void 0 ? "" : _d, props = __rest(_a, ["className", "containerClassName", "editorClassName"]);
    var _e = useDynamicTextEditor(__assign({}, props)), quillRef = _e.quillRef, quillInstance = _e.quillInstance, editorState = _e.editorState, setEditorState = _e.setEditorState, clearContent = _e.clearContent, focus = _e.focus, blur = _e.blur;
    // Merge refs if one is provided
    React.useImperativeHandle(ref, function () { return ({
        quillInstance: quillInstance,
        editorState: editorState,
        setEditorState: setEditorState,
        clearContent: clearContent,
        focus: focus,
        blur: blur,
        containerRef: quillRef.current,
    }); });
    return (React.createElement("div", { className: "dynamic-text-editor ".concat(className) },
        React.createElement("div", { ref: quillRef, className: "dynamic-text-editor-container ".concat(containerClassName, " ").concat(editorClassName) })));
};
var DynamicTextEditor = React.forwardRef(DynamicTextEditorBase);
DynamicTextEditor.displayName = "DynamicTextEditor";

exports.DynamicTextEditor = DynamicTextEditor;
exports.useDynamicTextEditor = useDynamicTextEditor;
//# sourceMappingURL=index.js.map
