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

export function minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.length > minLength) {
      control.setValue(value.slice(0, minLength), { emitEvent: false });
    }
    return null;
  };
}

export function vinValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.length !== length) {
      return { 'exactLength': true };
    }
    return null;
  };
}