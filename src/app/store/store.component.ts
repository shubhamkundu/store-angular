import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { DeleteDialogComponent, IDeleteDialogData } from '../delete-dialog/delete-dialog.component';
import { IProductDialogData, ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { IProduct, IStore } from './store.interfaces';
import { StoreService } from './store.service';

@Component({
  selector: 'store-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit, OnDestroy {
  loggedInUser: IUser;
  store: IStore;
  products: IProduct[];
  subscriptions: Subscription[];

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.subscriptions = [];
    if (this.isAdmin()) {
      this.getStoreByStoreId();
    } else {
      this.getStoreByStoreOwner();
    }
    this.products = [];
  }

  getStoreByStoreId() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.getStoreByStoreId(Number(this.route.snapshot.params.storeId))
      .subscribe((store: IStore) => {
        this.appService.spin$.next(false);
        this.handleStoreRes(store);
      });
    this.subscriptions.push(sub);
  }

  getStoreByStoreOwner() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.getStoreByStoreOwner()
      .subscribe((store: IStore) => {
        this.appService.spin$.next(false);
        this.handleStoreRes(store);
      });
    this.subscriptions.push(sub);
  }

  handleStoreRes(store) {
    if (store) {
      this.store = store;
      this.getProducts();
    }
  }

  getProducts() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.getProductsByStoreId(this.store.storeId)
      .subscribe((products: IProduct[]) => {
        this.appService.spin$.next(false);
        if (products) {
          this.products = products;
        }
      });
    this.subscriptions.push(sub);
  }

  openProductDialog(dialogType, product?: IProduct) {
    const dialogConfig: MatDialogConfig = {
      width: '500px'
    };
    const data: IProductDialogData = { dialogType, store: this.store };
    dialogConfig.data = data;
    if (dialogType === 'Edit') {
      dialogConfig.data.product = product;
    }
    const dialogRef = this.dialog.open(ProductDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((productData: IProduct) => {
        if (productData) {
          if (dialogType === 'Create') {
            this.createProduct(productData);
          } else if (dialogType === 'Edit') {
            this.editProduct(productData);
          }
        }
      });
  }

  openDeleteDialog(product: IProduct) {
    const dialogConfig: MatDialogConfig = {};
    const data: IDeleteDialogData = {
      deleteSubject: product.name
    };
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((deleted: boolean) => {
        if (deleted) {
          this.deleteProduct(product.productId);
        }
      });
  }

  createProduct(productData: IProduct) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.createProduct(productData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getProducts();
        }
      });
    this.subscriptions.push(sub);
  }

  editProduct(productData: IProduct) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.editProduct(productData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getProducts();
        }
      });
    this.subscriptions.push(sub);
  }

  deleteProduct(productId: number) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.deleteProduct(productId)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getProducts();
        }
      });
    this.subscriptions.push(sub);
  }

  isAdmin(): boolean {
    return this.loggedInUser.userRole === 'admin';
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    })
  }

}
