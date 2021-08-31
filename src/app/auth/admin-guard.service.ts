import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { IUser } from './auth.interfaces';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) { }
    canActivate(): boolean {
        return this.isAdmin();
    }

    isAdmin() {
        const loggedInUser: IUser = this.auth.decodeToken();
        return loggedInUser.userRole === 'admin';
    }
}