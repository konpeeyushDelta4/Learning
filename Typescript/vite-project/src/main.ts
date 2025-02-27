import { users } from './Users';

// Example using some() - checks if at least one user is from India
const hasIndianUser = users.some(user => user.address === 'India');
console.log('Has at least one Indian user:', hasIndianUser);

// Example using every() - checks if all users are adults (above 18)
const allAdults = users.every(user => user.age >= 18);
console.log('All users are adults:', allAdults);