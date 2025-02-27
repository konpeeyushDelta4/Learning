interface User {
    name: string,
    age: number,
    email: string,
    address: string
}

const peeyush: User = {
    name: 'Peeyush',
    age: 23,
    email: 'peeyush@email.com',
    address: 'India',
}

const john: User = {
    name: 'John Smith',
    age: 28,
    email: 'john.smith@email.com',
    address: 'United States',
}

const priya: User = {
    name: 'Priya Sharma',
    age: 25,
    email: 'priya.sharma@email.com',
    address: 'India',
}

const maria: User = {
    name: 'Maria Garcia',
    age: 31,
    email: 'maria.garcia@email.com',
    address: 'Spain',
}

const yuki: User = {
    name: 'Yuki Tanaka',
    age: 27,
    email: 'yuki.tanaka@email.com',
    address: 'Japan',
}

const alex: User = {
    name: 'Alex Johnson',
    age: 34,
    email: 'alex.j@email.com',
    address: 'Canada',
}

export const users = [peeyush, john, priya, maria, yuki, alex];
