import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AppService } from 'src/app/app.service';

export function passwordValidator(appService: AppService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = appService.validatePassword(control.value);
    return valid ? null : { invalidPassword: { value: control.value } };
  };
}

@Directive({
  selector: '[storeInvalidPassword]'
})
export class InvalidPasswordDirective {
  @Input('storeInvalidPassword') invalidPassword = '';

  constructor(private appService: AppService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.invalidPassword ? passwordValidator(this.appService)(control) : null;
  }
}
