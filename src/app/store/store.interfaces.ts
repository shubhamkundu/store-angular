export interface IStore {
    storeId?: number;
    name?: string;
    location?: string;
    phone?: number;
    storeOwner?: number;
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