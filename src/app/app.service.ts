import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';
import { Observable, Subject } from 'rxjs';
import { catchError, map, scan } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  msURL = environment.msURL;
  private handleError: HandleError;
  private spinnerTopRef = this.cdkSpinnerCreate();
  spin$: Subject<boolean> = new Subject();

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private overlay: Overlay
  ) {
    this.spin$
      .asObservable()
      .pipe(
        map(val => val ? 1 : -1),
        scan((acc, one) => (acc + one) >= 0 ? acc + one : 0, 0)
      )
      .subscribe(
        (res) => {
          if (res === 1) {
            this.spinnerTopRef.hasAttached() ? null : this.showSpinner();
          } else if (res === 0) {
            this.spinnerTopRef.hasAttached() ? this.stopSpinner() : null;
          }
        }
      );

    this.handleError = httpErrorHandler.createHandleError('AppService');
  }

  private cdkSpinnerCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }

  private showSpinner() {
    console.log("attach");
    this.spinnerTopRef.attach(new ComponentPortal(MatSpinner));
  }

  private stopSpinner() {
    console.log("dispose");
    this.spinnerTopRef.detach();
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !email || re.test(email.toLowerCase());
  }

  validatePassword(password: string): boolean {
    return /[A-Z]/.test(password) // at least one capital letter
      && /[a-z]/.test(password) // at least one small letter
      && /[0-9]/.test(password) // at least one digit
      && /[^A-Za-z0-9]/.test(password); // at least one special character
  }

  validateName(name: string): boolean {
    return !(/[^A-Za-z ]/.test(name)); // only alphabets and space
  }
}
