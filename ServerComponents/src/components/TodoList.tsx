'use client';

import {ServerComponent} from './ServerComponent';

// This is a client component wrapper that just forwards props to the server component
const TodoList = ({ filter }: { filter: string }) => {
    return <ServerComponent filter={filter} />;
};

export default TodoList;