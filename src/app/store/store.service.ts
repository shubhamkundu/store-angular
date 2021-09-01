import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../auth/auth.interfaces';
import { HttpErrorHandler, HandleError } from './../http-error-handler.service';
import { ICategory, IProduct, IStore, IStoreRequest } from './store.interfaces';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  msURL = environment.msURL;
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('StoreService');
  }

  getStoreByStoreOwner(): Observable<IStore> {
    return this.http.get<IStore>(`${this.msURL}/store/by-store-owner`)
      .pipe(
        catchError(this.handleError('getStoreByStoreOwner', null as IStore))
      );
  }

  getStoreByStoreId(storeId: number): Observable<IStore> {
    return this.http.get<IStore>(`${this.msURL}/store/by-store-id?storeId=${storeId}`)
      .pipe(
        catchError(this.handleError('getStoreByStoreId', null as IStore))
      );
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.msURL}/user/`)
      .pipe(
        catchError(this.handleError('getAllUsers', null as IUser[]))
      );
  }

  getAllUsersHavingStore(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.msURL}/user/having-store`)
      .pipe(
        catchError(this.handleError('getAllUsersHavingStore', null as IUser[]))
      );
  }

  getUserByUserId(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.msURL}/user?userId=${userId}`)
      .pipe(
        catchError(this.handleError('getUserByUserId', null as IUser))
      );
  }

  changeUserRole(userUpdateBody: IUser): Observable<IUser> {
    return this.http.patch<IUser>(`${this.msURL}/user/user-role`, userUpdateBody)
      .pipe(
        catchError(this.handleError('changeUserRole', null as IUser))
      );
  }

  deleteUser(userId: number): Observable<IUser> {
    return this.http.delete<IUser>(`${this.msURL}/user?userId=${userId}`)
      .pipe(
        catchError(this.handleError('deleteUser', null as IUser))
      );
  }

  createStore(storeData: IStore): Observable<IStore> {
    return this.http.post<IStore>(`${this.msURL}/store/`, storeData)
      .pipe(
        catchError(this.handleError('createStore', null as IStore))
      );
  }

  editStore(storeData: IStore): Observable<IStore> {
    return this.http.patch<IStore>(`${this.msURL}/store/`, storeData)
      .pipe(
        catchError(this.handleError('editStore', null as IStore))
      );
  }

  deleteStore(storeId: number): Observable<IStore> {
    return this.http.delete<IStore>(`${this.msURL}/store?storeId=${storeId}`)
      .pipe(
        catchError(this.handleError('deleteStore', null as IStore))
      );
  }

  createProduct(productData: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.msURL}/product/`, productData)
      .pipe(
        catchError(this.handleError('createProduct', null as IProduct))
      );
  }

  editProduct(productData: IProduct): Observable<IProduct> {
    return this.http.patch<IProduct>(`${this.msURL}/product/`, productData)
      .pipe(
        catchError(this.handleError('editProduct', null as IProduct))
      );
  }

  deleteProduct(productId: number): Observable<IProduct> {
    return this.http.delete<IProduct>(`${this.msURL}/product?productId=${productId}`)
      .pipe(
        catchError(this.handleError('deleteProduct', null as IProduct))
      );
  }

  getProductsByStoreId(storeId: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.msURL}/product/by-store-id?storeId=${storeId}`)
      .pipe(
        catchError(this.handleError('getProductsByStoreId', null as IProduct[]))
      );
  }

  getAllCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.msURL}/category/`)
      .pipe(
        catchError(this.handleError('getAllCategories', null as ICategory[]))
      );
  }

  getAllStores(): Observable<IStore[]> {
    return this.http.get<IStore[]>(`${this.msURL}/store/`)
      .pipe(
        catchError(this.handleError('getAllStores', null as IStore[]))
      );
  }

  getAllStoreRequests(): Observable<IStoreRequest[]> {
    return this.http.get<IStoreRequest[]>(`${this.msURL}/store-request/`)
      .pipe(
        catchError(this.handleError('getAllStoreRequests', null as IStoreRequest[]))
      );
  }

  getStoreRequestsByLoggedInUser(): Observable<IStoreRequest[]> {
    return this.http.get<IStoreRequest[]>(`${this.msURL}/store-request/by-store-requestor`)
      .pipe(
        catchError(this.handleError('getStoreRequestsByLoggedInUser', null as IStoreRequest[]))
      );
  }

  createStoreRequest(storeRequestData: IStoreRequest): Observable<IStoreRequest> {
    return this.http.post<IStoreRequest>(`${this.msURL}/store-request/`, storeRequestData)
      .pipe(
        catchError(this.handleError('createStoreRequest', null as IStoreRequest))
      );
  }

  editStoreRequest(storeRequestData: IStoreRequest): Observable<IStoreRequest> {
    return this.http.patch<IStoreRequest>(`${this.msURL}/store-request/`, storeRequestData)
      .pipe(
        catchError(this.handleError('editStoreRequest', null as IStoreRequest))
      );
  }

  approveStoreRequest(storeRequestId: number): Observable<IStoreRequest> {
    return this.http.patch<IStoreRequest>(`${this.msURL}/store-request/approve?storeRequestId=${storeRequestId}`, {})
      .pipe(
        catchError(this.handleError('approveStoreRequest', null as IStoreRequest))
      );
  }

  rejectStoreRequest(rejectBody: IStoreRequest): Observable<IStoreRequest> {
    return this.http.patch<IStoreRequest>(`${this.msURL}/store-request/reject`, rejectBody)
      .pipe(
        catchError(this.handleError('rejectStoreRequest', null as IStoreRequest))
      );
  }

  deleteStoreRequest(storeRequestId: number): Observable<IStoreRequest> {
    return this.http.delete<IStoreRequest>(`${this.msURL}/store-request?storeRequestId=${storeRequestId}`)
      .pipe(
        catchError(this.handleError('deleteStoreRequest', null as IStoreRequest))
      );
  }

}
