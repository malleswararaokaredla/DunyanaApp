import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputSpace]'
})
export class InputSpaceDirective {

  constructor() { }
  @HostListener('keydown', ['$event'])
  public onInputChange(e: KeyboardEvent) {
    const code = e.keyCode || e.which;
    let control: HTMLInputElement = <HTMLInputElement>e.srcElement;
    if (code === 32 && !control.value.trim().length) {
      e.preventDefault();
    }

}
}