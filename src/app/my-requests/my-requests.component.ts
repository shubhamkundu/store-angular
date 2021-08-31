import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { DeleteDialogComponent, IDeleteDialogData } from '../delete-dialog/delete-dialog.component';
import { IStoreRequestDialogData, StoreRequestDialogComponent } from '../store-request-dialog/store-request-dialog.component';
import { IStore, IStoreRequest } from '../store/store.interfaces';
import { StoreService } from '../store/store.service';

@Component({
  selector: 'store-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  loggedInUser: IUser;
  store: IStore;
  requests: IStoreRequest[];
  pendingRequests: IStoreRequest[];
  approvedRequests: IStoreRequest[];
  rejectedRequests: IStoreRequest[];
  subscriptions: Subscription[];

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getLoggedInUser();
    this.subscriptions = [];
    this.requests = [];
    this.pendingRequests = [];
    this.approvedRequests = [];
    this.rejectedRequests = [];
    this.getStoreByStoreOwner();
    this.getStoreRequestsByLoggedInUser();
  }

  getLoggedInUser() {
    this.loggedInUser = this.authService.getLoggedInUser();
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
    }
  }

  getStoreRequestsByLoggedInUser() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.getStoreRequestsByLoggedInUser()
      .subscribe((storeRequests: IStoreRequest[]) => {
        this.appService.spin$.next(false);
        this.handleStoreRequestRes(storeRequests);
      });
    this.subscriptions.push(sub);
  }

  handleStoreRequestRes(storeRequests: IStoreRequest[]) {
    if (storeRequests) {
      this.requests = storeRequests;
      this.pendingRequests = this.requests.filter(sr => sr.storeRequestStatus === 'pending');
      this.approvedRequests = this.requests.filter(sr => sr.storeRequestStatus === 'approved');
      this.rejectedRequests = this.requests.filter(sr => sr.storeRequestStatus === 'rejected');
    }
  }

  openStoreRequestDialog(
    dialogType,
    storeRequestType: 'insert' | 'update',
    storeRequest?: IStoreRequest
  ) {
    const dialogConfig: MatDialogConfig = {
      width: '500px'
    };
    const data: IStoreRequestDialogData = { dialogType, storeRequestType };
    dialogConfig.data = data;
    if (dialogType === 'Edit') {
      dialogConfig.data.storeRequest = storeRequest;
    } else if (storeRequestType === 'update') {
      dialogConfig.data.storeRequest = this.store;
    }
    const dialogRef = this.dialog.open(StoreRequestDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((storeRequestData: IStoreRequest) => {
        if (storeRequestData) {
          storeRequestData.storeRequestType = storeRequestType;
          if (dialogType === 'Create') {
            this.createStoreRequest(storeRequestData);
          } else if (dialogType === 'Edit') {
            this.editStoreRequest(storeRequestData);
          }
        }
      });
  }

  openDeleteDialog(storeRequest: IStoreRequest) {
    const dialogConfig: MatDialogConfig = {};
    const data: IDeleteDialogData = {
      deleteSubject: `${storeRequest.name} request`
    };
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((deleted: boolean) => {
        if (deleted) {
          this.deleteStoreRequest(storeRequest.storeRequestId);
        }
      });
  }

  createStoreRequest(storeRequestData: IStoreRequest) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.createStoreRequest(storeRequestData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getStoreRequestsByLoggedInUser();
        }
      });
    this.subscriptions.push(sub);
  }

  editStoreRequest(storeRequestData: IStoreRequest) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.editStoreRequest(storeRequestData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getStoreRequestsByLoggedInUser();
        }
      });
    this.subscriptions.push(sub);
  }

  deleteStoreRequest(storeRequestId: number) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.deleteStoreRequest(storeRequestId)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getStoreRequestsByLoggedInUser();
        }
      });
    this.subscriptions.push(sub);
  }

  isRequestCreationDisabled() {
    return !!this.pendingRequests.length || !!this.loggedInUser.storeId;
  }

  isRequestUpdationDisabled() {
    return !!this.pendingRequests.length || !this.loggedInUser.storeId;
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
