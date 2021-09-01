import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { DeleteDialogComponent, IDeleteDialogData } from '../delete-dialog/delete-dialog.component';
import { StoreDialogComponent } from '../store-dialog/store-dialog.component';
import { IStore } from '../store/store.interfaces';
import { StoreService } from '../store/store.service';

@Component({
  selector: 'store-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  loggedInUser: IUser;
  allUsers: IUser[];
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
    this.allUsers = [];
    this.getAllUsers();
  }

  getLoggedInUser() {
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  getAllUsers() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.getAllUsers()
      .subscribe((allUsers: IUser[]) => {
        this.appService.spin$.next(false);
        this.handleAllUsersRes(allUsers);
      });
    this.subscriptions.push(sub);
  }

  handleAllUsersRes(allUsers: IUser[]) {
    if (allUsers) {
      this.allUsers = allUsers;
    }
  }

  changeUserRole(user: IUser) {
    const userUpdateBody: IUser = {
      userId: user.userId,
      userRole: user.userRole
    };
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.changeUserRole(userUpdateBody)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) { }
      });
    this.subscriptions.push(sub);
  }

  openStoreDialog(dialogType) {
    const dialogConfig: MatDialogConfig = {
      width: '500px',
      data: { dialogType }
    };
    const dialogRef = this.dialog.open(StoreDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((storeData: IStore) => {
        if (storeData) {
            this.createStore(storeData);
        }
      });
  }

  openDeleteDialog(user: IUser) {
    const dialogConfig: MatDialogConfig = {};
    const data: IDeleteDialogData = {
      deleteSubject: `${user.name} (${user.email})`
    };
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.beforeClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteUser(user.userId);
        }
      });
  }

  createStore(storeData: IStore) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.createStore(storeData)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getAllUsers();
        }
      });
    this.subscriptions.push(sub);
  }

  deleteUser(userId: number) {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.deleteUser(userId)
      .subscribe(result => {
        this.appService.spin$.next(false);
        if (result) {
          this.getAllUsers();
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
