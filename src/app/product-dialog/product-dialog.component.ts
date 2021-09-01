import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { ICategory, IProduct, IStore } from '../store/store.interfaces';
import { StoreService } from '../store/store.service';

export interface IProductDialogData {
  dialogType: 'Create' | 'Edit';
  store?: IStore;
  product?: IProduct;
}

@Component({
  selector: 'store-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit, OnDestroy {
  PRODUCT_NAME_MIN_LENGTH = 3;
  AVAILABLE_QUANTITY_PATTERN = /^\d?\d?\d?\d?\d?$/; // 0 to 99999 and blank
  DESCRIPTION_MIN_LENGTH = 10;
  DESCRIPTION_MAX_LENGTH = 1000;
  form: FormGroup;
  categoryList: ICategory[];
  subscriptions: Subscription[];

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProductDialogData,
    private storeService: StoreService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.subscriptions = [];
    this.initializeForm();
    if (this.data.dialogType === 'Edit') {
      this.setFormValues();
    }

    this.getAllCategories();
  }

  getAllCategories() {
    this.appService.spin$.next(true);
    const sub: Subscription = this.storeService.getAllCategories()
      .subscribe((allCategories: ICategory[]) => {
        this.appService.spin$.next(false);
        this.categoryList = allCategories;
      });
    this.subscriptions.push(sub);
  }

  initializeForm() {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(this.PRODUCT_NAME_MIN_LENGTH)
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
      availableQuantity: new FormControl('', [
        Validators.required,
        Validators.pattern(this.AVAILABLE_QUANTITY_PATTERN)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(this.DESCRIPTION_MIN_LENGTH),
        Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)
      ])
    });
  }

  setFormValues() {
    this.form.controls['name'].setValue(this.data.product.name);
    this.form.controls['category'].setValue(this.data.product.category);
    this.form.controls['availableQuantity'].setValue(this.data.product.availableQuantity);
    this.form.controls['description'].setValue(this.data.product.description);
  }

  onClickSubmit() {
    const productData: IProduct = this.getProductData();
    this.dialogRef.close(productData);
  }

  onClickClose() {
    this.dialogRef.close();
  }

  getProductData(): IProduct {
    const productData: IProduct = {};
    if (this.data.dialogType === 'Edit') {
      productData.productId = this.data.product.productId;
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['name'].value.trim() !== this.data.product.name) {
      productData.name = this.form.controls['name'].value.trim();
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['category'].value !== this.data.product.category) {
      productData.category = this.form.controls['category'].value;
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['availableQuantity'].value !== this.data.product.availableQuantity) {
      productData.availableQuantity = this.form.controls['availableQuantity'].value;
    }
    if (this.data.dialogType === 'Create' ||
      this.form.controls['description'].value.trim() !== this.data.product.description) {
      productData.description = this.form.controls['description'].value.trim();
    }
    if (this.data.dialogType === 'Create') {
      productData.storeId = this.data.store.storeId;
    }

    return productData;
  }

  isSubmitDisabled() {
    const productData: IProduct = this.getProductData();
    delete productData.productId;
    return this.form.invalid || (this.data.dialogType === 'Edit' && Object.keys(productData).length <= 0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

}
