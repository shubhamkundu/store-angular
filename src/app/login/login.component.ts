import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ILoginData, ILoginResponse } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { emailValidator } from '../shared/validators/invalid-email.directive';
import { AppService } from '../app.service';

@Component({
  selector: 'store-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  PASSWORD_MIN_LENGTH = 8;
  form: FormGroup;
  loginSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        emailValidator(this.appService)
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }

  submit(): void {
    if (this.form.valid) {
      let loginData: ILoginData;
      loginData = {
        email: this.form.controls.email.value.trim(),
        password: this.form.controls.password.value
      };
      this.appService.spin$.next(true);
      this.loginSubscription = this.authService.login(loginData)
        .subscribe((loginRes: ILoginResponse) => {
          this.appService.spin$.next(false);
          this.handleLoginSuccess(loginRes);
        });
    }
  }

  handleLoginSuccess(loginRes: ILoginResponse): void {
    if (loginRes) {
      sessionStorage.setItem('token', loginRes.token);
      this.authService.resetLoggedInUser();
      this.router.navigate(['home']);
    }
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
