export interface User {
    id: number;
    email: string;
    username: string;
}

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials extends AuthCredentials {
    email: string;
    confirmPassword: string;
}
