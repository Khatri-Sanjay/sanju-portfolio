import { Component } from '@angular/core';
import {NgxPrintDirective} from 'ngx-print';
import {UpperCasePipe} from '@angular/common';
import {PersonalDetails} from '../../../../../@core/data/personal-details';
import {Skills} from '../../../../../@core/data/skills';
import {Experience} from '../../../../../@core/data/experience';
import {Projects} from '../../../../../@core/data/projects';
import {ComingSoonComponent} from '../../coming-soon/coming-soon.component';

@Component({
  selector: 'app-resume-type-one',
  imports: [
    NgxPrintDirective,
    UpperCasePipe,
    ComingSoonComponent
  ],
  templateUrl: './resume-type-one.component.html',
  standalone: true,
  styleUrl: './resume-type-one.component.scss'
})
export class ResumeTypeOneComponent {
  personalData = PersonalDetails;
  skillsData = Skills.getDetailedSkills();
  experience = Experience;
  projects = Projects;
}
