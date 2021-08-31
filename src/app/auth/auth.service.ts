import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppService } from '../app.service';
import { HttpErrorHandler, HandleError } from './../http-error-handler.service';
import { ISignupData, IUser, ILoginData, ILoginResponse } from './auth.interfaces';

const skipAuthHttpOptions = {
    headers: new HttpHeaders({
        skipAuth: 'true'
    })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    msURL = environment.msURL;
    private handleError: HandleError;
    private loggedInUser: IUser;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private router: Router,
        private appService: AppService
    ) {
        this.handleError = httpErrorHandler.createHandleError('AuthService');
    }

    resetLoggedInUser() {
        this.loggedInUser = this.decodeToken();
        // if (!this.loggedInUser) {
        //     this.router.navigate(['login']);
        // }
    }

    getLoggedInUser(): IUser {
        return this.loggedInUser;
    }

    decodeToken(): IUser {
        const token = this.getAuthToken();
        if (token && token !== 'undefined') {
            try {
                const user = JSON.parse(atob(token.split('.')[1]));
                if (user.exp * 1000 < new Date().getTime()) {
                    return null;
                }
                return user;
            } catch (e) {
                console.error(e);
                return null;
            }
        }
        return null;
    }

    isAuthenticated(): boolean {
        return this.getLoggedInUser() ? true : false;
    }

    getAuthToken(): string {
        return sessionStorage.getItem('token');
    }

    removeAuthToken() {
        sessionStorage.removeItem('token');
    }

    signup(signupData: ISignupData): Observable<IUser> {
        return this.http.post<IUser>(`${this.msURL}/auth/`, signupData, skipAuthHttpOptions)
            .pipe(
                catchError(this.handleError('signup', null as IUser))
            );
    }

    login(loginData: ILoginData): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(`${this.msURL}/auth/login`, loginData, skipAuthHttpOptions)
            .pipe(
                catchError(this.handleError('login', null as ILoginResponse))
            );
    }

    logout() {
        this.removeAuthToken();
        this.resetLoggedInUser();
        this.router.navigate(['login']);
        this.appService.spin$.next(false);
    }
}
