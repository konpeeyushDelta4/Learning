// No 'use client' directive here - this is a Server Component

import { fetchTodos, Todo } from '../data';

// This is a Server Component that can use async/await
export async function ServerComponent({ filter }: { filter: string }) {
    // Server-side data fetching
    const todos: Todo[] = await fetchTodos(filter);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="border-b bg-gray-50 px-4 py-3">
                <h2 className="font-semibold">Todo List ({filter})</h2>
                <p className="text-sm text-gray-500">
                    This component was rendered on the server with data fetched for filter: {filter}
                </p>
            </div>

            <ul className="divide-y">
                {todos.map(todo => (
                    <li key={todo.id} className="px-4 py-3 flex items-center">
                        <span className={`w-4 h-4 mr-4 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {todo.title}
                        </span>
                    </li>
                ))}
                {todos.length === 0 && (
                    <li className="px-4 py-3 text-gray-500 text-center">No todos found</li>
                )}
            </ul>
        </div>
    );
}