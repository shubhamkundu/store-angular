export interface SignupData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface User {
    userId: number;
    name: string;
    email: string;
    userRole?: string;
    createdOn: string;
    isDeleted: boolean;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}