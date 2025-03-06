# Dynamic Template Editor

A modern rich text editor with template suggestions and intelligent highlighting. This editor allows users to create and edit content with dynamic template variables that are highlighted and suggested as you type.

## Features

- **Rich Text Editing**: Full-featured text editor based on Quill.js
- **Template Suggestions**: Type `{{` to trigger intelligent template suggestions
- **Syntax Highlighting**: Automatic highlighting of template variables
- **Keyboard Navigation**: Navigate and select suggestions using keyboard shortcuts
- **Visual Feedback**: Beautiful animations and visual cues for better UX
- **Responsive Design**: Works on all screen sizes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/RichTextEditor.git
   cd RichTextEditor
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Core Hooks

The editor is built using several custom React hooks:

### useQuill

Initializes and manages the Quill editor instance.

```typescript
const { quillRef, quillInstance } = useQuill();
```

- `quillRef`: React ref to attach to the editor container
- `quillInstance`: The Quill editor instance

### useRegex

Handles template pattern detection and suggestion management.

```typescript
const { showSuggestions, position, filteredSuggestions, selectedIndex, setSelectedIndex, selectSuggestion } = useRegex({ quillInstance });
```

- `showSuggestions`: Boolean to control suggestion visibility
- `position`: Coordinates for positioning the suggestions dropdown
- `filteredSuggestions`: Filtered list of suggestions based on user input
- `selectedIndex`: Currently selected suggestion index
- `setSelectedIndex`: Function to update the selected index
- `selectSuggestion`: Function to insert the selected suggestion

### usePaint

Handles the highlighting of template variables in the editor.

```typescript
usePaint({ quillInstance });
```

This hook scans the editor content and applies custom formatting to text within `{{...}}` delimiters.

## Components

### Editor

The main editor component that integrates all hooks and manages the editor state.

### ImprovedSuggestions

Displays the suggestions dropdown with proper positioning and keyboard navigation.

### Widget

Shows keyboard shortcuts and navigation hints when the editor is focused.

## Keyboard Shortcuts

| Key(s)    | Action                            |
| --------- | --------------------------------- |
| `{{`      | Trigger template suggestions      |
| ↑/↓       | Navigate through suggestions      |
| Enter/Tab | Select the highlighted suggestion |
| Esc       | Close suggestions                 |

## Customization

You can customize the available templates by modifying the `defaultSuggestions` array in `src/utils/constants.ts`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
