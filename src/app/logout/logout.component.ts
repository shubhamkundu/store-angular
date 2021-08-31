import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'store-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.spin$.next(true);
    this.authService.logout();
  }

}
