import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginData, LoginResponse } from '../auth/auth.interface';
import { AuthService } from '../auth/auth.service';
import { emailValidator } from '../shared/validators/invalid-email.directive';
import { passwordValidator } from '../shared/validators/invalid-password.directive';
import { StoreService } from '../store.service';

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
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        emailValidator(this.storeService)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(this.PASSWORD_MIN_LENGTH),
        passwordValidator(this.storeService)
      ])
    });
  }

  submit(): void {
    if (this.form.valid) {
      let loginData: LoginData;
      loginData = {
        email: this.form.controls.email.value.trim(),
        password: this.form.controls.password.value
      };
      this.loginSubscription = this.authService.login(loginData)
        .subscribe((loginRes: LoginResponse) => {
          this.handleLoginSuccess(loginRes);
        });
    }
  }

  handleLoginSuccess(loginRes: LoginResponse): void {
    if (loginRes) {
      sessionStorage.setItem('token', loginRes.token);
      this.router.navigate(['home']);
    }
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
