export interface ISignupData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface IUser {
    userId: number;
    name: string;
    email: string;
    userRole?: string;
    storeId?: number;
    createdOn?: string;
    isDeleted?: false;
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    user: IUser;
}