export interface User {
    id: number;
    email: string;
    username: string;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends AuthCredentials {
    confirmPassword: string;
}
