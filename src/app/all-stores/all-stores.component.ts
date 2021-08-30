import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { DeleteDialogComponent, IDeleteDialogData } from '../delete-dialog/delete-dialog.component';
import { IStoreDialogData, StoreDialogComponent } from '../store-dialog/store-dialog.component';
import { IStore } from '../store/store.interfaces';
import { StoreService } from '../store/store.service';

@Component({
  selector: 'store-all-stores',
  templateUrl: './all-stores.component.html',
  styleUrls: ['./all-stores.component.css']
})
export class AllStoresComponent implements OnInit {
  loggedInUser: IUser;
  stores: IStore[];
  subscriptions: Subscription[];

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.subscriptions = [];
    this.stores = [];
    this.getAllStores();
  }

  getAllStores() {
    const sub: Subscription = this.storeService.getAllStores()
      .subscribe((allStores: IStore[]) => {
        this.handleAllStoresRes(allStores);
      });
    this.subscriptions.push(sub);
  }

  handleAllStoresRes(allStores: IStore[]) {
    if (allStores) {
      this.stores = allStores;
      this.getStoreOwners();
    }
  }

  openStoreDialog(dialogType, store?: IStore) {
    const dialogConfig: MatDialogConfig = {
      width: '500px'
    };
    const data: IStoreDialogData = { dialogType };
    dialogConfig.data = data;
    if (dialogType === 'Edit') {
      dialogConfig.data.store = store;
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

  openDeleteDialog(store: IStore) {
    const dialogConfig: MatDialogConfig = {};
    const data: IDeleteDialogData = {
      deleteSubject: store.name
    };
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((storeData: IStore) => {
        if (storeData) {
          this.deleteStore(store.storeId);
        }
      });
  }

  createStore(storeData: IStore) {
    const sub: Subscription = this.storeService.createStore(storeData)
      .subscribe(result => {
        if (result) {
          this.getAllStores();
        }
      });
    this.subscriptions.push(sub);
  }

  editStore(storeData: IStore) {
    const sub: Subscription = this.storeService.editStore(storeData)
      .subscribe(result => {
        if (result) {
          this.getAllStores();
        }
      });
    this.subscriptions.push(sub);
  }

  deleteStore(storeId: number) {
    const sub: Subscription = this.storeService.deleteStore(storeId)
      .subscribe(result => {
        if (result) {
          this.getAllStores();
        }
      });
    this.subscriptions.push(sub);
  }

  isAdmin(): boolean {
    return this.loggedInUser.userRole === 'admin';
  }

  getStoreOwners() {
    this.storeService.getAllUsersHavingStore()
      .subscribe((allUsers: IUser[]) => {
        this.stores.forEach((store: IStore) => {
          store.storeOwner = allUsers.find(u => u.userId === store.storeOwnerId);
        });
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    })
  }

}
