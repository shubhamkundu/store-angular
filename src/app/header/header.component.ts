import { Component, OnInit } from '@angular/core';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'store-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedInUser: IUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.loggedInUser?.userRole === 'admin';
  }
}
