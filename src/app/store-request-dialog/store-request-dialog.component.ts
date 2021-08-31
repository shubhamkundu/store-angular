import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { IUser } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { nameValidator } from '../shared/validators/invalid-name.directive';
import { IStoreRequest } from '../store/store.interfaces';

export interface IStoreRequestDialogData {
  dialogType: 'Create' | 'Edit';
  storeRequestType: 'insert' | 'update';
  storeRequest?: IStoreRequest;
}

@Component({
  selector: 'store-store-request-dialog',
  templateUrl: './store-request-dialog.component.html',
  styleUrls: ['./store-request-dialog.component.css']
})
export class StoreRequestDialogComponent implements OnInit {
  STORE_NAME_MIN_LENGTH = 3;
  LOCATION_MIN_LENGTH = 3;
  PHONE_PATTERN = /^[0-9]{10}$/;
  form: FormGroup;
  loggedInUser: IUser;

  constructor(
    public dialogRef: MatDialogRef<StoreRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IStoreRequestDialogData,
    private appService: AppService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getLoggedInUser();
    this.initializeForm();

    if (this.data.dialogType === 'Edit' || this.data.storeRequestType === 'update') {
      this.setFormValues();
    }
  }

  getLoggedInUser() {
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  initializeForm() {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(this.STORE_NAME_MIN_LENGTH),
        nameValidator(this.appService)
      ]),
      location: new FormControl('', [
        Validators.required,
        Validators.minLength(this.LOCATION_MIN_LENGTH)
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(this.PHONE_PATTERN)
      ])
    });
  }

  setFormValues() {
    this.form.controls['name'].setValue(this.data.storeRequest.name);
    this.form.controls['location'].setValue(this.data.storeRequest.location);
    this.form.controls['phone'].setValue(this.data.storeRequest.phone);
  }

  onClickClose() {
    this.dialogRef.close();
  }

  getStoreRequestData(): IStoreRequest {
    const storeData: IStoreRequest = {};
    if (this.data.dialogType === 'Edit') {
      storeData.storeRequestId = this.data.storeRequest.storeRequestId;
    } else if (this.data.storeRequestType === 'update') {
      storeData.storeId = this.data.storeRequest.storeId;
      storeData.storeOwnerId = this.data.storeRequest.storeOwnerId;
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['name'].value.trim() !== this.data.storeRequest.name) {
      storeData.name = this.form.controls['name'].value.trim();
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['location'].value.trim() !== this.data.storeRequest.location) {
      storeData.location = this.form.controls['location'].value.trim();
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['phone'].value !== this.data.storeRequest.phone) {
      storeData.phone = this.form.controls['phone'].value;
    }
    return storeData;
  }

  isSubmitDisabled() {
    const storeRequestData: IStoreRequest = this.getStoreRequestData();
    delete storeRequestData.storeRequestId;
    return this.form.invalid || (this.data.dialogType === 'Edit' && Object.keys(storeRequestData).length <= 0);
  }

}
