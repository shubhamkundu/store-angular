import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StoreService } from 'src/app/store.service';

export function passwordValidator(storeService: StoreService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = storeService.validatePassword(control.value);
    return valid ? null : { invalidPassword: { value: control.value } };
  };
}

@Directive({
  selector: '[storeInvalidPassword]'
})
export class InvalidPasswordDirective {
  @Input('storeInvalidPassword') invalidPassword = '';

  constructor(private storeService: StoreService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.invalidPassword ? passwordValidator(this.storeService)(control) : null;
  }
}
