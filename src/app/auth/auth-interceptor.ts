import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { StoreService } from '../store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private storeService: StoreService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!req.headers.get('skipAuth')) {
            const authToken = this.storeService.getAuthToken();
            req = req.clone({ setHeaders: { Authorization: authToken } });
        }
        return next.handle(req);
    }
}