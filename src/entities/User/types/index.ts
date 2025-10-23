// Re-export types from generated API types
import type { User } from "../../../shared/types";

// Export the types directly
export type { User };

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials extends AuthCredentials {
    email: string;
    confirmPassword: string;
}
