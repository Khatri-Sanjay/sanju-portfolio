import { Component } from '@angular/core';
import {KanbanComponent} from './components/kanban/kanban.component';

@Component({
  selector: 'app-task',
  imports: [
    KanbanComponent
  ],
  standalone: true,
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

}
