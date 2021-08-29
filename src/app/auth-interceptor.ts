import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpHandler, HttpRequest, HttpEvent
} from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!req.headers.get('skipAuth')) {
            const authToken = this.authService.getAuthToken();
            req = req.clone({ setHeaders: { Authorization: authToken } });
        }
        return next.handle(req);
    }
}