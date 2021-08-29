import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../auth/auth.interfaces';
import { HttpErrorHandler, HandleError } from './../http-error-handler.service';
import { ICategory, IProduct, IStore } from './store.interfaces';

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

}
