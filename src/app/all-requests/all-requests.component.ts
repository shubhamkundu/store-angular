import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { ApproveDialogComponent, IApproveDialogData } from '../approve-dialog/approve-dialog.component';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { IRejectDialogData, RejectDialogComponent } from '../reject-dialog/reject-dialog.component';
import { IStore, IStoreRequest } from '../store/store.interfaces';
import { StoreService } from '../store/store.service';

@Component({
  selector: 'store-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit {
  loggedInUser: IUser;
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
    this.getAllStoreRequests();
  }

  getLoggedInUser() {
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  getAllStoreRequests() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.getAllStoreRequests()
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

  openApproveDialog(storeRequest: IStoreRequest) {
    const dialogConfig: MatDialogConfig = {};
    const data: IApproveDialogData = { storeRequest };
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ApproveDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((approved: boolean) => {
        if (approved) {
          this.approveStoreRequest(storeRequest);
        }
      });
  }

  openRejectDialog(storeRequest: IStoreRequest) {
    const dialogConfig: MatDialogConfig = {};
    const data: IRejectDialogData = { storeRequest };
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(RejectDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((rejectData: IStoreRequest) => {
        if (rejectData) {
          this.rejectStoreRequest(storeRequest.storeRequestId, rejectData.rejectReason);
        }
      });
  }

  approveStoreRequest(storeRequest: IStoreRequest) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.approveStoreRequest(storeRequest.storeRequestId)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getAllStoreRequests();
          if (storeRequest.storeRequestType === 'insert') {
            this.createStore(storeRequest);
          } else if (storeRequest.storeRequestType === 'update') {
            this.editStore(storeRequest);
          }
        }
      });
    this.subscriptions.push(sub);
  }

  rejectStoreRequest(storeRequestId: number, rejectReason: string) {
    const rejectBody: IStoreRequest = { storeRequestId, rejectReason };
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.rejectStoreRequest(rejectBody)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getAllStoreRequests();
        }
      });
    this.subscriptions.push(sub);
  }

  createStore(storeRequest: IStoreRequest) {
    const storeRequestData: IStore = {
      name: storeRequest.name,
      location: storeRequest.location,
      phone: storeRequest.phone,
      storeOwnerId: storeRequest.createdBy
    };
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.createStore(storeRequestData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
        }
      });
    this.subscriptions.push(sub);
  }

  editStore(storeRequest: IStoreRequest) {
    const storeRequestData: IStore = {};
    if (storeRequest.storeId !== undefined) {
      storeRequestData.storeId = storeRequest.storeId;
    }
    if (storeRequest.storeOwnerId !== undefined) {
      storeRequestData.storeOwnerId = storeRequest.storeOwnerId;
    }
    if (storeRequest.name !== undefined) {
      storeRequestData.name = storeRequest.name;
    }
    if (storeRequest.location !== undefined) {
      storeRequestData.location = storeRequest.location;
    }
    if (storeRequest.phone !== undefined) {
      storeRequestData.phone = storeRequest.phone;
    }
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.editStore(storeRequestData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
        }
      });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    })
  }

}
