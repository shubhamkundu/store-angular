import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { LogoutComponent } from './logout/logout.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { InvalidEmailDirective } from './shared/validators/invalid-email.directive';
import { InvalidNameDirective } from './shared/validators/invalid-name.directive';
import { InvalidPasswordDirective } from './shared/validators/invalid-password.directive';
import { StoreComponent } from './store/store.component';
import { AuthInterceptor } from './auth-interceptor';
import { StoreDialogComponent } from './store-dialog/store-dialog.component';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { AllStoresComponent } from './all-stores/all-stores.component';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { StoreRequestDialogComponent } from './store-request-dialog/store-request-dialog.component';
import { RequestTableComponent } from './request-table/request-table.component';
import { ApproveDialogComponent } from './approve-dialog/approve-dialog.component';
import { RejectDialogComponent } from './reject-dialog/reject-dialog.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { UserTableComponent } from './user-table/user-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent,
    FooterComponent,
    LogoutComponent,
    ErrorDialogComponent,
    InvalidEmailDirective,
    InvalidNameDirective,
    InvalidPasswordDirective,
    StoreComponent,
    StoreDialogComponent,
    ProductDialogComponent,
    DeleteDialogComponent,
    SuccessDialogComponent,
    AllStoresComponent,
    AllRequestsComponent,
    MyRequestsComponent,
    StoreRequestDialogComponent,
    RequestTableComponent,
    ApproveDialogComponent,
    RejectDialogComponent,
    AllUsersComponent,
    UserTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
