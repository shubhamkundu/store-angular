import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpErrorHandler, HandleError } from './../http-error-handler.service';
import { SignupData, User, LoginData, LoginResponse } from './auth.interface';

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

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler,
        private router: Router
    ) {
        this.handleError = httpErrorHandler.createHandleError('AuthService');
    }

    getLoggedInUser(): User {
        const token = sessionStorage.getItem('token');
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

    signup(signupData: SignupData): Observable<User> {
        return this.http.post<User>(`${this.msURL}/auth/`, signupData, skipAuthHttpOptions)
            .pipe(
                catchError(this.handleError('signup', null as User))
            );
    }

    login(loginData: LoginData): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.msURL}/auth/login`, loginData, skipAuthHttpOptions)
            .pipe(
                catchError(this.handleError('login', null as LoginResponse))
            );
    }

    logout() {
        sessionStorage.removeItem('token');
        setTimeout(() => {
            this.router.navigate(['login'])
        }, 3000);
    }
}
