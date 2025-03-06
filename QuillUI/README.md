# QuillUI

A modern, customizable React UI component library for rich text editing based on Quill.js.

## Installation

```bash
npm install quill-ui
# or
yarn add quill-ui
```

## Quick Start

```jsx
import React, { useState } from "react";
import { Editor } from "quill-ui";
import "quill-ui/dist/index.css";

function MyEditor() {
  const [content, setContent] = useState("");

  const handleChange = (html) => {
    setContent(html);
  };

  return <Editor height="300px" placeholder="Start writing..." onChange={handleChange} />;
}
```

## Features

- 🎨 **Fully customizable** - Style and configure every aspect of the editor
- 📱 **Responsive** - Works on all screen sizes
- 🧩 **Modular** - Use only the components you need
- 🔌 **Extensible** - Easily integrate with your existing UI components
- 🛠️ **TypeScript support** - Full TypeScript definitions included

## Components

### Editor

The main editor component with built-in toolbar.

```jsx
<Editor
  value={content}
  onChange={handleChange}
  height="300px"
  toolbar={[
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
  ]}
  readOnly={false}
/>
```

#### Props

| Prop                | Type                     | Default                | Description                         |
| ------------------- | ------------------------ | ---------------------- | ----------------------------------- |
| `value`             | `string`                 | `undefined`            | HTML content (controlled)           |
| `defaultValue`      | `string`                 | `undefined`            | Initial HTML content (uncontrolled) |
| `onChange`          | `function`               | `undefined`            | Called when content changes         |
| `onChangeSelection` | `function`               | `undefined`            | Called when selection changes       |
| `onFocus`           | `function`               | `undefined`            | Called when editor is focused       |
| `onBlur`            | `function`               | `undefined`            | Called when editor loses focus      |
| `onReady`           | `function`               | `undefined`            | Called when editor is initialized   |
| `height`            | `string\|number`         | `'auto'`               | Editor height                       |
| `width`             | `string\|number`         | `'100%'`               | Editor width                        |
| `minHeight`         | `string\|number`         | `'150px'`              | Minimum editor height               |
| `maxHeight`         | `string\|number`         | `undefined`            | Maximum editor height               |
| `placeholder`       | `string`                 | `'Write something...'` | Placeholder text                    |
| `readOnly`          | `boolean`                | `false`                | Whether the editor is read-only     |
| `toolbar`           | `boolean\|array\|object` | `true`                 | Toolbar configuration               |
| `modules`           | `object`                 | `{}`                   | Quill modules configuration         |
| `formats`           | `array`                  | `undefined`            | Allowed formats                     |
| `theme`             | `'snow'\|'bubble'\|null` | `'snow'`               | Editor theme                        |
| `className`         | `string`                 | `''`                   | Additional CSS class                |
| `style`             | `object`                 | `undefined`            | Inline styles                       |
| `id`                | `string`                 | `undefined`            | Element ID                          |

### Toolbar

A standalone toolbar component that can be used with the Editor.

```jsx
<Editor>
  <Toolbar
    position="top"
    sticky={true}
    options={[
      ["bold", "italic"],
      ["link", "image"],
    ]}
  />
</Editor>
```

#### Props

| Prop        | Type              | Default     | Description                     |
| ----------- | ----------------- | ----------- | ------------------------------- |
| `options`   | `array\|object`   | `undefined` | Toolbar options                 |
| `position`  | `'top'\|'bottom'` | `'top'`     | Toolbar position                |
| `sticky`    | `boolean`         | `false`     | Whether the toolbar is sticky   |
| `disabled`  | `boolean`         | `false`     | Whether the toolbar is disabled |
| `className` | `string`          | `''`        | Additional CSS class            |
| `style`     | `object`          | `undefined` | Inline styles                   |
| `id`        | `string`          | `undefined` | Element ID                      |

### ContentBlock

A component for structured content within the editor.

```jsx
<Editor>
  <ContentBlock contentEditable={false}>
    <h2>Non-editable heading</h2>
  </ContentBlock>
</Editor>
```

#### Props

| Prop                      | Type                 | Default     | Description                     |
| ------------------------- | -------------------- | ----------- | ------------------------------- |
| `contentEditable`         | `boolean`            | `false`     | Whether the content is editable |
| `dangerouslySetInnerHTML` | `{ __html: string }` | `undefined` | Inner HTML content              |
| `className`               | `string`             | `''`        | Additional CSS class            |
| `style`                   | `object`             | `undefined` | Inline styles                   |
| `id`                      | `string`             | `undefined` | Element ID                      |

## Customization

### Toolbar Configuration

You can customize the toolbar by passing an array of toolbar options:

```jsx
<Editor
  toolbar={[
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ]}
/>
```

### Custom Modules

You can extend Quill with custom modules:

```jsx
<Editor
  modules={{
    toolbar: true,
    history: {
      delay: 2000,
      maxStack: 500,
    },
    // Add your custom modules here
  }}
/>
```

## License

MIT
