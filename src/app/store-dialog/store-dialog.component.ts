import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { IUser } from '../auth/auth.interfaces';
import { nameValidator } from '../shared/validators/invalid-name.directive';
import { IStore } from '../store/store.interfaces';
import { StoreService } from '../store/store.service';

export interface IStoreDialogData {
  dialogType: 'Create' | 'Edit';
  store?: IStore;
}

@Component({
  selector: 'store-store-dialog',
  templateUrl: './store-dialog.component.html',
  styleUrls: ['./store-dialog.component.css']
})
export class StoreDialogComponent implements OnInit, OnDestroy {
  STORE_NAME_MIN_LENGTH = 3;
  LOCATION_MIN_LENGTH = 3;
  PHONE_PATTERN = /^[0-9]{10}$/;
  form: FormGroup;
  storeOwnerList: IUser[];
  subscriptions: Subscription[]

  constructor(
    public dialogRef: MatDialogRef<StoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IStoreDialogData,
    private appService: AppService,
    private storeService: StoreService
  ) { }

  ngOnInit() {
    this.subscriptions = [];

    this.initializeForm();

    if (this.data.dialogType === 'Edit') {
      this.setFormValues();
    }

    const sub: Subscription = this.storeService.getAllUsers()
      .subscribe((allUsers: IUser[]) => {
        if (this.data.dialogType === 'Create') {
          this.storeOwnerList = allUsers.filter(user => !user.storeId);
        } else if (this.data.dialogType === 'Edit') {
          this.storeOwnerList = allUsers.filter(user => user.storeId);
        }
      });
    this.subscriptions.push(sub);
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
      ]),
      storeOwner: new FormControl('', [
        Validators.required
      ])
    });
  }

  setFormValues() {
    this.form.controls['name'].setValue(this.data.store.name);
    this.form.controls['location'].setValue(this.data.store.location);
    this.form.controls['phone'].setValue(this.data.store.phone);
    this.form.controls['storeOwner'].setValue(this.data.store.storeOwner);
  }

  onClickClose() {
    this.dialogRef.close();
  }

  getStoreData(): IStore {
    const storeData: IStore = {};
    if (this.data.dialogType === 'Edit') {
      storeData.storeId = this.data.store.storeId;
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['name'].value.trim() !== this.data.store.name) {
      storeData.name = this.form.controls['name'].value.trim();
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['location'].value.trim() !== this.data.store.location) {
      storeData.location = this.form.controls['location'].value.trim();
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['phone'].value !== this.data.store.phone) {
      storeData.phone = this.form.controls['phone'].value;
    }
    if (this.data.dialogType === 'Create') {
      storeData.storeOwner = this.form.controls['storeOwner'].value;
    }
    return storeData;
  }

  isStoreOwnerDisabled() {
    return this.data.dialogType === 'Edit';
  }

  isSubmitDisabled() {
    return this.form.invalid;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.onClickClose();
  }

}
