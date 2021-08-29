import { Directive, Input } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AppService } from 'src/app/app.service';

export function nameValidator(appService: AppService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = appService.validateName(control.value);
    return valid ? null : { invalidName: { value: control.value } };
  };
}

@Directive({
  selector: '[storeInvalidName]'
})
export class InvalidNameDirective {
  @Input('storeInvalidName') invalidName = '';

  constructor(private appService: AppService) { }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.invalidName ? nameValidator(this.appService)(control) : null;
  }
}
