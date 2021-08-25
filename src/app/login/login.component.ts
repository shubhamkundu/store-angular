import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginData, LoginResponse } from '../auth/auth.interface';
import { AuthService } from '../auth/auth.service';
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
      email: new FormControl('', [Validators.required, this.emailValidator()]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(this.PASSWORD_MIN_LENGTH),
        this.passwordValidator()])
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
    sessionStorage.setItem('token', loginRes.token);
    this.router.navigate(['home']);
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = this.storeService.validateEmail(control.value);
      return valid ? null : { invalidEmail: { value: control.value } };
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = this.storeService.validatePassword(control.value);
      return valid ? null : { invalidPassword: { value: control.value } };
    };
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
