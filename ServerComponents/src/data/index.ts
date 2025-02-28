export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

// Mock data
const allTodos: Todo[] = [
    { id: 1, title: 'Learn React Server Components', completed: false },
    { id: 2, title: 'Build a demo application', completed: true },
    { id: 3, title: 'Write documentation', completed: false },
    { id: 4, title: 'Share with the team', completed: true },
    { id: 5, title: 'Gather feedback', completed: false },
];

// Simulate server-side data fetching with artificial delay
export async function fetchTodos(filter: string): Promise<Todo[]> {
    // Add a delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Filter the todos based on the filter parameter
    switch (filter) {
        case 'active':
            return allTodos.filter(todo => !todo.completed);
        case 'completed':
            return allTodos.filter(todo => todo.completed);
        default:
            return allTodos;
    }
}