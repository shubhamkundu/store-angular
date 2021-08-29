import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  msURL = environment.msURL;
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('AppService');
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
