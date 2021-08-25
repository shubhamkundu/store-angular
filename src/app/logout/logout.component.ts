import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'store-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  loggedOut: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedOut = false;
    setTimeout(() => {
      this.authService.logout();
      this.loggedOut = true;
    }, 3000);
  }

}
