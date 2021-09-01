import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'store-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, AfterViewInit {
  USER_ROLES = [
    {
      userRole: 'subUser',
      displayValue: 'Sub User'
    },
    {
      userRole: 'admin',
      displayValue: 'Admin'
    }
  ]
  loggedInUser: IUser;
  @Input() users: MatTableDataSource<IUser>;
  @Output() changeUserRole = new EventEmitter<IUser>();
  @Output() createStore = new EventEmitter();
  @Output() deleteUser = new EventEmitter<IUser>();
  displayedColumns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getLoggedInUser();
    this.displayedColumns = [];
    this.displayedColumns.push('name');
    this.displayedColumns.push('email');
    this.displayedColumns.push('userRole');
    this.displayedColumns.push('joinedOn');
    this.displayedColumns.push('store');
    this.displayedColumns.push('actions');
  }

  getLoggedInUser() {
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
    this.users.sort = this.sort;
  }

  onChangeUserRole(user: IUser) {
    this.changeUserRole.emit(user);
  }

  onCreateStore(user: IUser) {
    this.createStore.emit();
  }

  onClickDelete(user: IUser) {
    this.deleteUser.emit(user);
  }

  getUserRoleDisplayValue(userRole: 'admin' | 'subUser') {
    const userRoleObj = this.USER_ROLES.find(ur => ur.userRole === userRole);
    return userRoleObj ? userRoleObj.displayValue : '';
  }

}
