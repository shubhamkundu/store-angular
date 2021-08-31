import { IUser } from "../auth/auth.interfaces";

export interface IStore {
    storeId?: number;
    name?: string;
    location?: string;
    phone?: number;
    storeOwnerId?: number;
    storeOwner?: IUser;
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number;
    isDeleted?: false;
}

export interface IProduct {
    productId?: number;
    name?: string;
    category?: string;
    availableQuantity?: number;
    description?: string;
    storeId?: number;
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number;
    isDeleted?: false;
}

export interface ICategory {
    categoryId: number;
    categoryName: string;
}

export interface IStoreRequest {
    storeRequestId?: number;
    storeId?: number;
    storeOwnerId?: number;
    name?: string;
    location?: string;
    phone?: number;
    storeRequestType?: 'insert' | 'update';
    storeRequestStatus?: 'pending' | 'approved' | 'rejected';
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number;
    approvedOn?: string;
    approvedBy?: number;
    rejectReason?: string;
    rejectedOn?: string;
    rejectedBy?: number;
    isDeleted?: boolean;
    deletedOn?: string;
    deletedBy?: number;
}