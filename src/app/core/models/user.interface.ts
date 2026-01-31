export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: 'ADMIN' | 'USER';
    status?: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;
    password?: string;
}
