import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StoreService } from 'src/app/store.service';

export function nameValidator(storeService: StoreService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = storeService.validateName(control.value);
    return valid ? null : { invalidName: { value: control.value } };
  };
}

@Directive({
  selector: '[storeInvalidName]'
})
export class InvalidNameDirective {
  @Input('storeInvalidName') invalidName = '';

  constructor(private storeService: StoreService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.invalidName ? nameValidator(this.storeService)(control) : null;
  }
}
