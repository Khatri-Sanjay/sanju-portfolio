import {inject, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'lineBreak'
})
export class LineBreakPipe implements PipeTransform {

  private sanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    if (!value) return value;
    return this.sanitizer.bypassSecurityTrustHtml(
      value.replace(/\n/g, '<br>')
    );
  }

}
