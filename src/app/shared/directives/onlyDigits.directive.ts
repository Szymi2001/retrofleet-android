import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[onlyDigits]'
})
export class OnlyDigitsDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    const filteredValue = value.replace(/[^0-9]/g, '');
    
    this.ngControl.control?.setValue(filteredValue, { emitEvent: false });
  }
}
