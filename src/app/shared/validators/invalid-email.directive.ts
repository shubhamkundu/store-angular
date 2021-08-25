import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StoreService } from 'src/app/store.service';

export function emailValidator(storeService: StoreService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = storeService.validateEmail(control.value);
    return valid ? null : { invalidEmail: { value: control.value } };
  };
}

@Directive({
  selector: '[storeInvalidEmail]'
})
export class InvalidEmailDirective {
  @Input('storeInvalidEmail') invalidEmail = '';

  constructor(private storeService: StoreService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.invalidEmail ? emailValidator(this.storeService)(control) : null;
  }
}
