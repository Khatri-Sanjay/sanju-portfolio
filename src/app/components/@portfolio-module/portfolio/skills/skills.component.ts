import { Component } from '@angular/core';
import {TeckStackComponent} from '../teck-stack/teck-stack.component';

@Component({
  selector: 'app-skills',
  imports: [
    TeckStackComponent
  ],
  templateUrl: './skills.component.html',
  standalone: true,
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {

}
