import { Component } from '@angular/core';
import {NgxPrintDirective} from 'ngx-print';

@Component({
  selector: 'app-resume-type-one',
  imports: [
    NgxPrintDirective
  ],
  templateUrl: './resume-type-one.component.html',
  standalone: true,
  styleUrl: './resume-type-one.component.scss'
})
export class ResumeTypeOneComponent {

}
