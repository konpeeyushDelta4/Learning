import React, { useState, useOptimistic, useTransition } from 'react';

// Define the Todo type
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

// Mock API call that simulates toggling a todo item's completed status
const toggleTodoApi = async (id: number): Promise<boolean> => {
    console.log(`API call: Toggling todo ${id}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Randomly fail to demonstrate error handling (30% chance)
    if (Math.random() < 0.3) {
        throw new Error(`Failed to update todo ${id}`);
    }

    return true;
};

const Optimistic: React.FC = () => {
    // Initial todos state
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: 'Learn React', completed: false },
        { id: 2, text: 'Build a project', completed: false },
        { id: 3, text: 'Deploy to production', completed: false },
    ]);

    // Track pending requests to show loading indicators
    const [pendingId, setPendingId] = useState<number | null>(null);

    // Add useTransition for optimistic updates
    const [isPending, startTransition] = useTransition();

    // Use optimistic state - this will immediately update the UI
    const [optimisticTodos, addOptimisticTodo] = useOptimistic<Todo[],{ id: number; completed: boolean }>(
        todos, (currentTodos, newTodo) => {
            // Apply the optimistic update
            return currentTodos.map(todo =>
                todo.id === newTodo.id ? { ...todo, completed: newTodo.completed } : todo
            );
        }
    );

    // Handle toggling a todo item
    const handleToggleTodo = async (id: number): Promise<void> => {
        const todo = todos.find(todo => todo.id === id);
        if (!todo) return;

        const newCompleted = !todo.completed;
        setPendingId(id);

        try {
            // Wrap in startTransition to properly use optimistic updates
            startTransition(() => {
                // Apply optimistic update immediately within the transition
                addOptimisticTodo({ id, completed: newCompleted });
            });

            // Make the actual API call
            await toggleTodoApi(id);

            // If successful, update the real state
            setTodos(prevTodos => prevTodos.map(t =>
                t.id === id ? { ...t, completed: newCompleted } : t
            ));
        } catch (error) {
            // If failed, the optimistic state will be automatically reconciled
            // with the actual state (todos)
            console.error((error as Error).message);

            // Show error message
            alert(`Error: ${(error as Error).message}`);
        } finally {
            // Clear pending state
            setPendingId(null);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Optimistic UI Updates</h1>

            <p className="text-sm text-gray-500 mb-4">
                Click on a todo to toggle its completion status.
                Notice how the UI updates immediately before the API call completes.
                There's a 30% chance of failure to demonstrate error recovery.
            </p>

            <ul className="space-y-2">
                {optimisticTodos.map(todo => (
                    <li
                        key={todo.id}
                        onClick={() => handleToggleTodo(todo.id)}
                        className={`
                        p-3 rounded border cursor-pointer flex items-center
                        ${todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
                        ${pendingId === todo.id ? 'opacity-60' : 'opacity-100'}
                        `}
                    >
                        <span className={`
                          inline-block w-5 h-5 mr-3 rounded border
                          ${todo.completed
                                ? 'bg-green-500 border-green-600 text-white flex items-center justify-center'
                                : 'border-gray-400'
                            }
                        `}>
                            {todo.completed && '✓'}
                        </span>

                        <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                            {todo.text}
                        </span>

                        {pendingId === todo.id && (
                            <div className="ml-auto">
                                <div className="h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <div className="mt-6 p-3 bg-blue-50 text-sm border border-blue-100 rounded">
                <strong>How this works:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>When you click a todo, it updates instantly in the UI</li>
                    <li>The API call happens in the background (1.5s delay)</li>
                    <li>If it succeeds, the state is permanently updated</li>
                    <li>If it fails (30% chance), the UI reverts automatically</li>
                    <li>Uses React's transition API for optimistic updates</li>
                </ul>
            </div>
        </div>
    );
};

export default Optimistic;