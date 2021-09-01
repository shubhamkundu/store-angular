import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllStoresComponent } from './all-stores/all-stores.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { AdminGuardService as AdminGuard } from './auth/admin-guard.service';
import { NoauthGuardService as NoauthGuard } from './auth/noauth-guard.service copy';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SignupComponent } from './signup/signup.component';
import { StoreComponent } from './store/store.component';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { AllUsersComponent } from './all-users/all-users.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [NoauthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoauthGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store/:storeId',
    component: StoreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'all-stores',
    component: AllStoresComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'all-requests',
    component: AllRequestsComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'my-requests',
    component: MyRequestsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'all-users',
    component: AllUsersComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
