import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AppService } from 'src/app/app.service';

export function emailValidator(appService: AppService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = appService.validateEmail(control.value);
    return valid ? null : { invalidEmail: { value: control.value } };
  };
}

@Directive({
  selector: '[storeInvalidEmail]'
})
export class InvalidEmailDirective {
  @Input('storeInvalidEmail') invalidEmail = '';

  constructor(private appService: AppService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.invalidEmail ? emailValidator(this.appService)(control) : null;
  }
}
