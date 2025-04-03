import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.scss'
})
export class DragDropComponent {
  todoTasks = [{ name: 'Task 1' }, { name: 'Task 2' }];
  inProgressTasks = [{ name: 'Task 3' }];
  doneTasks = [{ name: 'Task 4' }];

  // Handles the drop event, and updates task lists accordingly
  onDrop(event: CdkDragDrop<any[]>, column: string) {
    const previousColumn = event.item.data.column;
    const currentColumn = column;

    // Move the task from one list to another
    if (previousColumn !== currentColumn) {
      this.removeTask(event.item.data, previousColumn);
      this.addTaskToColumn(event.item.data, currentColumn);
    }
  }

  // Add a new task to the specified column
  addTask(column: string) {
    const newTask = { name: `New Task ${Date.now()}`, column };
    this.addTaskToColumn(newTask, column);
  }

  // Add task to a specific column
  private addTaskToColumn(task: any, column: string) {
    switch (column) {
      case 'todo':
        this.todoTasks.push(task);
        break;
      case 'inProgress':
        this.inProgressTasks.push(task);
        break;
      case 'done':
        this.doneTasks.push(task);
        break;
    }
  }

  // Delete task from a specific column
  deleteTask(task: any, column: string) {
    switch (column) {
      case 'todo':
        this.todoTasks = this.todoTasks.filter(t => t !== task);
        break;
      case 'inProgress':
        this.inProgressTasks = this.inProgressTasks.filter(t => t !== task);
        break;
      case 'done':
        this.doneTasks = this.doneTasks.filter(t => t !== task);
        break;
    }
  }

  // Remove task from its current column
  private removeTask(task: any, column: string) {
    switch (column) {
      case 'todo':
        this.todoTasks = this.todoTasks.filter(t => t !== task);
        break;
      case 'inProgress':
        this.inProgressTasks = this.inProgressTasks.filter(t => t !== task);
        break;
      case 'done':
        this.doneTasks = this.doneTasks.filter(t => t !== task);
        break;
    }
  }
}
