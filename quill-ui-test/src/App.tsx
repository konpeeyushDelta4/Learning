import { useQuill } from "quill-ui";
import { useState } from "react";

const customToolbar = [["bold", "italic"]];

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState<"snow" | "bubble">("snow");
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const {
    quillRef: customEditorRef,
    clearContent,
    focus,
    blur,
  } = useQuill({
    theme,
    placeholder: "Write your prompt here...",
    fontSize: "1.8rem",
    height: "300px",
    toolbar: customToolbar,
    onChange: (value) => setContent(value),
    formats: ["bold", "italic"],
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${isDarkMode ? "bg-[#1a1b1e]" : "bg-gray-50"}`}>
      <div className={`w-full max-w-3xl ${isDarkMode ? "bg-[#25262b]" : "bg-white"} rounded-xl shadow-lg p-6 m-4 transition-colors duration-200`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"} transition-colors duration-200`}>Your GPT Custom Toolbar</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === "snow" ? "bubble" : "snow")}
              className={`p-2 rounded-lg transition-colors duration-200 
                ${isDarkMode ? "bg-[#2c2d31] hover:bg-[#3c3d41] text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
            >
              {theme === "snow" ? "💭" : "❄️"}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors duration-200 
                ${isDarkMode ? "bg-[#2c2d31] hover:bg-[#3c3d41] text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Editor Controls */}
        <div className={`flex gap-2 mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
          <button
            onClick={clearContent}
            className={`px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium
              ${isDarkMode ? "bg-[#2c2d31] hover:bg-[#3c3d41]" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Clear
          </button>
          <button
            onClick={focus}
            className={`px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium
              ${isDarkMode ? "bg-[#2c2d31] hover:bg-[#3c3d41]" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Focus
          </button>
          <button
            onClick={blur}
            className={`px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium
              ${isDarkMode ? "bg-[#2c2d31] hover:bg-[#3c3d41]" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Blur
          </button>
        </div>

        <div
          ref={customEditorRef}
          className={`border rounded-lg transition-all duration-200
            [&_.ql-editor]:!min-h-[300px] [&_.ql-editor]:!text-[1.8rem] [&_.ql-editor]:!leading-normal
            ${
              isDarkMode
                ? `border-gray-600 [&_.ql-toolbar]:!bg-[#2c2d31] [&_.ql-toolbar]:!border-gray-600 [&_.ql-container]:!border-gray-600 
                   [&_.ql-editor]:!text-gray-200 [&_.ql-editor]:!bg-[#25262b] [&_.ql-stroke]:!stroke-gray-400 [&_.ql-picker-label]:!text-gray-400
                   ${isFocused ? "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.1)]" : "hover:border-gray-500"}`
                : `border-gray-200 [&_.ql-toolbar]:!bg-gray-50 [&_.ql-container]:!bg-white
                   ${isFocused ? "border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]" : "hover:border-gray-300"}`
            } 
            ${theme === "bubble" ? "[&_.ql-bubble.ql-toolbar]:!z-50 [&_.ql-editor]:!p-4" : "[&_.ql-snow.ql-toolbar]:!p-2"}
            [&_.ql-toolbar]:!rounded-t-lg [&_.ql-container]:!rounded-b-lg
            [&_.ql-editor]:!px-4 [&_.ql-editor]:!py-3
            [&_.ql-editor.ql-blank::before]:!text-gray-400 [&_.ql-editor.ql-blank::before]:!font-normal [&_.ql-editor.ql-blank::before]:!not-italic
            [&_.ql-formats]:!mr-0 [&_.ql-formats]:!ml-2`}
        />

        {/* Preview Section */}
        <div className="mt-6">
          <h3 className={`text-xl font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Preview</h3>
          <div
            className={`p-4 rounded-lg max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
              ${isDarkMode ? "bg-[#2c2d31] text-gray-200" : "bg-gray-50 text-gray-700"}
              [&_p]:!text-[1.8rem] [&_p]:!leading-normal [&_p]:!break-words [&_p]:!whitespace-pre-wrap`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
