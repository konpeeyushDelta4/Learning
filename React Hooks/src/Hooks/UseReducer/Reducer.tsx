import React, { useReducer } from "react";

// Step 1: Define the state type
interface TodoState {
  todos: Todo[];
  todoCount: number;
  completedCount: number;
  inputValue: string;
  isLoading: boolean;
  error: string | null;
}

// Define the Todo item type
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Step 2: Define action types
type TodoAction =
  | { type: "ADD_TODO" }
  | { type: "TOGGLE_TODO"; id: number }
  | { type: "DELETE_TODO"; id: number }
  | { type: "SET_INPUT_VALUE"; value: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "CLEAR_ALL" };

// Step 3: Define the initial state
const initialState: TodoState = {
  todos: [],
  todoCount: 0,
  completedCount: 0,
  inputValue: "",
  isLoading: false,
  error: null,
};

// Step 4: Create the reducer function
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  const { type } = action;

  switch (type) {
    case "ADD_TODO": {
      if (!state.inputValue.trim()) return state;

      const newTodo: Todo = {
        id: Date.now(),
        text: state.inputValue,
        completed: false,
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
        todoCount: state.todoCount + 1,
        inputValue: "", // Clear input after adding
      };
    }

    case "TOGGLE_TODO": {
      const updatedTodos = state.todos.map((todo) => 
        (todo.id === action.id ? { ...todo, completed: !todo.completed } : todo)
      );

      // Count completed todos
      const newCompletedCount = updatedTodos.filter((todo) => todo.completed).length;

      return {
        ...state,
        todos: updatedTodos,
        completedCount: newCompletedCount,
      };
    }

    case "DELETE_TODO": {
      const filteredTodos = state.todos.filter((todo) => todo.id !== action.id);
      const deletedTodo = state.todos.find((todo) => todo.id === action.id);

      return {
        ...state,
        todos: filteredTodos,
        todoCount: state.todoCount - 1,
        completedCount: deletedTodo?.completed ? state.completedCount - 1 : state.completedCount,
      };
    }
    
    case "CLEAR_ALL":
      return {
        ...state,
        todos: [],
        todoCount: 0,
        completedCount: 0
      };

    case "SET_INPUT_VALUE": {
      return {
        ...state,
        inputValue: action.value,
      };
    }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
}

// Step 5: Create the component that uses useReducer
const Reducer: React.FC = () => {
  // Initialize useReducer with our reducer and initial state
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Destructure values from state
  const { todos, todoCount, completedCount, inputValue, isLoading, error } = state;

  // Event handlers that dispatch actions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_INPUT_VALUE", value: e.target.value });
  };

  const handleAddTodo = () => {
    dispatch({ type: "ADD_TODO" });
  };

  const handleToggleTodo = (id: number) => {
    dispatch({ type: "TOGGLE_TODO", id });
  };

  const handleDeleteTodo = (id: number) => {
    dispatch({ type: "DELETE_TODO", id });
  };
  
  const handleClearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  // Simulate an async operation (like fetching todos)
  const handleFetchTodos = async () => {
    dispatch({ type: "SET_LOADING", isLoading: true });
    dispatch({ type: "SET_ERROR", error: null });

    try {
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Normally you'd fetch data here and then update state
      // For now we'll just add a sample todo
      dispatch({ type: "SET_INPUT_VALUE", value: "Sample fetched todo" });
      dispatch({ type: "ADD_TODO" });
      dispatch({ type: "SET_LOADING", isLoading: false });
    } catch (err) {
      dispatch({ type: "SET_ERROR", error: "Failed to fetch todos" });
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-6">
        <h1 className="text-2xl font-bold text-white mb-1">useReducer Todo App</h1>
        <p className="text-blue-100 text-sm">Managing complex state with reducers</p>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-700">{todoCount}</div>
            <div className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Total</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
            <div className="text-2xl font-bold text-green-700">{completedCount}</div>
            <div className="text-xs uppercase tracking-wide text-green-600 font-semibold">Completed</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-center border border-amber-100">
            <div className="text-2xl font-bold text-amber-700">{todoCount - completedCount}</div>
            <div className="text-xs uppercase tracking-wide text-amber-600 font-semibold">Remaining</div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="mb-6">
          <div className="flex shadow-sm">
            <input 
              type="text" 
              value={inputValue} 
              onChange={handleInputChange} 
              placeholder="Add a new todo" 
              className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && inputValue.trim() && handleAddTodo()}
            />
            <button 
              onClick={handleAddTodo} 
              disabled={!inputValue.trim()}
              className={`px-4 rounded-r-lg font-medium transition-colors ${
                inputValue.trim() 
                  ? "bg-blue-500 text-white hover:bg-blue-600" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Add
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={handleFetchTodos} 
            disabled={isLoading}
            className={`flex-1 py-2 px-4 rounded-md font-medium flex items-center justify-center ${
              isLoading 
                ? "bg-gray-300 text-gray-500 cursor-wait" 
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Fetch Sample
              </span>
            )}
          </button>
          {todoCount > 0 && (
            <button 
              onClick={handleClearAll}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Todo List */}
        <div className="mt-2 mb-6">
          {todos.length > 0 ? (
            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`py-3 px-2 flex justify-between items-center group hover:bg-gray-50 transition-colors ${
                    todo.completed ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleToggleTodo(todo.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        todo.completed 
                          ? "bg-green-500 border-green-500 text-white" 
                          : "border-gray-400"
                      }`}
                    >
                      {todo.completed && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span className={`${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                      {todo.text}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete todo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : !isLoading && (
            <div className="py-8 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="text-gray-500">No todos yet. Add one above!</p>
            </div>
          )}
        </div>

        {/* How useReducer Works */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
          <h2 className="font-bold text-indigo-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-1 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            How useReducer Works:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-indigo-700">
            <li className="p-2 bg-white bg-opacity-70 rounded">Define state structure and action types</li>
            <li className="p-2 bg-white bg-opacity-70 rounded">Create a reducer function that handles actions</li>
            <li className="p-2 bg-white bg-opacity-70 rounded">
              Initialize with <code className="px-1 bg-indigo-100 rounded text-indigo-800 font-mono text-sm">useReducer(reducer, initialState)</code>
            </li>
            <li className="p-2 bg-white bg-opacity-70 rounded">
              Get <code className="px-1 bg-indigo-100 rounded text-indigo-800 font-mono text-sm">[state, dispatch]</code> from useReducer
            </li>
            <li className="p-2 bg-white bg-opacity-70 rounded">
              Call <code className="px-1 bg-indigo-100 rounded text-indigo-800 font-mono text-sm">dispatch({`{type: 'ACTION'}`})</code> to update state
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Reducer;