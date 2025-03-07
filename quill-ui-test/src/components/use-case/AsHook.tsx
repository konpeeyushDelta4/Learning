import { useDynamicTextEditor } from "quill-ui";
import { useState } from "react";

const AsHook = () => {
  const [theme, setTheme] = useState<"snow" | "bubble">("snow");
  const [content, setContent] = useState("");

  const { quillRef } = useDynamicTextEditor({
    theme,
    placeholder: "Start typing...",
    onChange: (value) => setContent(value),
    onFocus: () => console.log("Editor focused"),
    onBlur: () => console.log("Editor blurred"),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "snow" | "bubble")}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="snow">Snow Theme</option>
          <option value="bubble">Bubble Theme</option>
        </select>
      </div>

      <div ref={quillRef} className="min-h-[200px] border border-gray-200 rounded-lg" />

      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Preview</h3>
        <div className="prose max-w-none p-4 bg-gray-50 rounded-lg" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default AsHook;
