export interface User {
    id: string;
    username: string; // Keycloak preferred_username
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
}
