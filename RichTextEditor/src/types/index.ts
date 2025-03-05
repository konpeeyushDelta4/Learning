interface SuggestionProps {
    id: string | number;
    label: string;
    description: string;
    category?: string;
    type?: string;
    link?: string; // Include link property
}

interface SuggestionsProps {
    filteredSuggestions: SuggestionProps[];
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    selectSuggestion: (suggestion: SuggestionProps) => void;
}



export type {
    SuggestionProps,
    SuggestionsProps
}