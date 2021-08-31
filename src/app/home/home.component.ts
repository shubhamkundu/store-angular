import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { DeleteDialogComponent, IDeleteDialogData } from '../delete-dialog/delete-dialog.component';
import { IStoreDialogData, StoreDialogComponent } from '../store-dialog/store-dialog.component';
import { IStore } from '../store/store.interfaces';
import { StoreService } from '../store/store.service';

@Component({
  selector: 'store-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loggedInUser: IUser;
  store: IStore;
  subscriptions: Subscription[];

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.subscriptions = [];
    this.getStoreByStoreOwner();
  }

  getLoggedInUser() {
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  getStoreByStoreOwner() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.getStoreByStoreOwner()
      .subscribe((store: IStore) => {
        this.appService.spin$.next(false);
        if (store) {
          this.store = store;
        }
      });
    this.subscriptions.push(sub);
  }

  openStoreDialog(dialogType) {
    const dialogConfig: MatDialogConfig = {
      width: '500px'
    };
    const data: IStoreDialogData = { dialogType };
    dialogConfig.data = data;
    if (dialogType === 'Edit') {
      dialogConfig.data.store = this.store;
    }
    const dialogRef = this.dialog.open(StoreDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((storeData: IStore) => {
        if (storeData) {
          if (dialogType === 'Create') {
            this.createStore(storeData);
          } else if (dialogType === 'Edit') {
            this.editStore(storeData);
          }
        }
      });
  }

  openDeleteDialog() {
    const dialogConfig: MatDialogConfig = {};
    const data: IDeleteDialogData = {
      deleteSubject: this.store.name
    };
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((storeData: IStore) => {
        if (storeData) {
          this.deleteStore();
        }
      });
  }

  createStore(storeData: IStore) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.createStore(storeData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getStoreByStoreOwner();
        }
      });
    this.subscriptions.push(sub);
  }

  editStore(storeData: IStore) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.editStore(storeData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getStoreByStoreOwner();
        }
      });
    this.subscriptions.push(sub);
  }

  deleteStore() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.deleteStore(this.store.storeId)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getStoreByStoreOwner();
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
    });
  }

}
