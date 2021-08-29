import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISignupData, IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { emailValidator } from '../shared/validators/invalid-email.directive';
import { nameValidator } from '../shared/validators/invalid-name.directive';
import { passwordValidator } from '../shared/validators/invalid-password.directive';
import { AppService } from '../app.service';

@Component({
  selector: 'store-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  NAME_MIN_LENGTH = 3;
  PASSWORD_MIN_LENGTH = 8;
  form: FormGroup;
  signupSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(this.NAME_MIN_LENGTH),
        nameValidator(this.appService)
      ]),
      email: new FormControl('', [
        Validators.required,
        emailValidator(this.appService)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(this.PASSWORD_MIN_LENGTH),
        passwordValidator(this.appService)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ])
    });
  }

  submit(): void {
    if (this.form.valid) {
      let signupData: ISignupData;
      signupData = {
        name: this.form.controls.name.value.trim(),
        email: this.form.controls.email.value.trim(),
        password: this.form.controls.password.value,
        confirmPassword: this.form.controls.confirmPassword.value
      };
      this.signupSubscription = this.authService.signup(signupData)
        .subscribe((user: IUser) => {
          this.handleSignupSuccess(user);
        });
    }
  }

  handleSignupSuccess(user: IUser): void {
    if (user) {
      this.router.navigate(['login']);
    }
  }

  matchPassword(): boolean {
    return this.form.controls['password'].value === this.form.controls['confirmPassword'].value;
  }

  ngOnDestroy() {
    this.signupSubscription.unsubscribe();
  }
}
