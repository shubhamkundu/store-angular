import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignupData, User } from '../auth/auth.interface';
import { AuthService } from '../auth/auth.service';
import { emailValidator } from '../shared/validators/invalid-email.directive';
import { nameValidator } from '../shared/validators/invalid-name.directive';
import { passwordValidator } from '../shared/validators/invalid-password.directive';
import { StoreService } from '../store.service';

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
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(this.NAME_MIN_LENGTH),
        nameValidator(this.storeService)
      ]),
      email: new FormControl('', [
        Validators.required,
        emailValidator(this.storeService)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(this.PASSWORD_MIN_LENGTH),
        passwordValidator(this.storeService)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ])
    });
  }

  submit(): void {
    if (this.form.valid) {
      let signupData: SignupData;
      signupData = {
        name: this.form.controls.name.value.trim(),
        email: this.form.controls.email.value.trim(),
        password: this.form.controls.password.value,
        confirmPassword: this.form.controls.confirmPassword.value
      };
      this.signupSubscription = this.authService.signup(signupData)
        .subscribe((user: User) => {
          this.handleSignupSuccess(user);
        });
    }
  }

  handleSignupSuccess(user: User): void {
    this.router.navigate(['login']);
  }

  matchPassword(): boolean {
    return this.form.controls['password'].value === this.form.controls['confirmPassword'].value;
  }

  ngOnDestroy() {
    this.signupSubscription.unsubscribe();
  }
}
