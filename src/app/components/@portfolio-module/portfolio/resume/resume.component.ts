import {Component} from '@angular/core';
import {ResumeTypeTwoComponent} from './resume-type-two/resume-type-two.component';
import {ResumeTypeOneComponent} from './resume-type-one/resume-type-one.component';

@Component({
  selector: 'app-resume',
  imports: [
    ResumeTypeOneComponent,
    ResumeTypeTwoComponent
  ],
  templateUrl: './resume.component.html',
  standalone: true,
  styleUrl: './resume.component.scss'
})
export class ResumeComponent {

}
