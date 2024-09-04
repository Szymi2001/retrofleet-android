import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.length > maxLength) {
      control.setValue(value.slice(0, maxLength), { emitEvent: false });
    }
    return null;
  };
}
