import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../@core/interface/task.interface';
import { Board } from '../../@core/interface/board.interface';
import { TaskService } from '../../@core/service/task.service';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    CdkDropList,
    CdkDrag,
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent implements OnInit, OnDestroy {
  boards: Board[] = [];
  currentBoard: Board | null = null;

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  filteredTodoTasks: Task[] = [];
  filteredInProgressTasks: Task[] = [];
  filteredDoneTasks: Task[] = [];

  // Quick add form
  quickAddTaskName: string = '';
  quickAddColumn: string = 'todo';
  quickAddPriority: string = 'medium';

  // Search and filters
  searchTerm: string = '';
  priorityFilter: string = '';

  newTaskName: string = '';
  newTaskDescription: string = '';
  newTaskPriority: string = 'medium';

  newBoardName: string = '';

  editingTask: Task | null = null;
  currentColumn: string = '';
  modalTitle: string = 'Add New Task';
  formSubmitted = false;

  // Modal references
  taskModalRef: NgbModalRef | null = null;
  confirmModalRef: NgbModalRef | null = null;
  boardModalRef: NgbModalRef | null = null;

  // Subscriptions for cleanup
  private subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Subscribe to boards changes
    this.subscription.add(
      this.taskService.boards$.subscribe(boards => {
        this.boards = boards;

        // If we don't have a current board or it was deleted, select the first one
        if (!this.currentBoard || !boards.find(b => b.id === this.currentBoard?.id)) {
          this.currentBoard = boards[0];
        }

        this.loadTasks();
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  selectBoard(board: Board): void {
    this.currentBoard = board;
    this.loadTasks();
  }

  loadTasks(): void {
    if (!this.currentBoard) return;

    this.todoTasks = this.taskService.getTasks(this.currentBoard.id, 'todo');
    this.inProgressTasks = this.taskService.getTasks(this.currentBoard.id, 'inProgress');
    this.doneTasks = this.taskService.getTasks(this.currentBoard.id, 'done');

    // Apply filters
    this.filterTasks();
  }

  filterTasks(): void {
    const searchLower = this.searchTerm.toLowerCase();

    this.filteredTodoTasks = this.todoTasks.filter(task => {
      const matchesSearch = !this.searchTerm ||
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower));

      const matchesPriority = !this.priorityFilter || task.priority === this.priorityFilter;

      return matchesSearch && matchesPriority;
    });

    this.filteredInProgressTasks = this.inProgressTasks.filter(task => {
      const matchesSearch = !this.searchTerm ||
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower));
      const matchesPriority = !this.priorityFilter || task.priority === this.priorityFilter;
      return matchesSearch && matchesPriority;
    });

    this.filteredDoneTasks = this.doneTasks.filter(task => {
      const matchesSearch = !this.searchTerm ||
        task.name.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower));
      const matchesPriority = !this.priorityFilter || task.priority === this.priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.priorityFilter = '';
    this.filterTasks();
  }

  quickAddTask(): void {
    if (!this.currentBoard || !this.quickAddTaskName.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      name: this.quickAddTaskName,
      description: '',
      status: this.quickAddColumn,
      createdAt: new Date(),
      priority: this.quickAddPriority
    };

    this.taskService.addTask(this.currentBoard.id, newTask);
    this.quickAddTaskName = '';
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    if (!this.currentBoard) return;

    if (event.previousContainer === event.container) {
      // Reordering within the same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Moving between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update task status based on the new container
      const task = event.container.data[event.currentIndex];
      if (event.container.id === 'todo-list') {
        task.status = 'todo';
      } else if (event.container.id === 'inProgress-list') {
        task.status = 'inProgress';
      } else if (event.container.id === 'done-list') {
        task.status = 'done';
      }

      // Save the updated task
      this.taskService.updateTask(this.currentBoard.id, task);
    }
  }

  openAddTaskModal(taskModal: any, column: string): void {
    this.currentColumn = column;
    this.editingTask = null;
    this.resetForm();
    this.modalTitle = 'Add New Task';

    this.taskModalRef = this.modalService.open(taskModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  openEditTaskModal(taskModal: any, task: Task): void {
    this.editingTask = { ...task };
    this.newTaskName = task.name;
    this.newTaskDescription = task.description || '';
    this.newTaskPriority = task.priority;
    this.currentColumn = task.status;
    this.modalTitle = 'Edit Task';

    this.taskModalRef = this.modalService.open(taskModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  openAddBoardModal(boardModal: any): void {
    this.newBoardName = '';
    this.formSubmitted = false;

    this.boardModalRef = this.modalService.open(boardModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  saveBoard(): void {
    this.formSubmitted = true;

    if (this.newBoardName.trim()) {
      const newBoard = this.taskService.addBoard(this.newBoardName.trim());
      this.currentBoard = newBoard;
      this.loadTasks();

      if (this.boardModalRef) {
        this.boardModalRef.close();
      }
    }
  }

  openDeleteBoard(boardModal: any): void {
    if (!this.currentBoard) return;

    this.boardModalRef = this.modalService.open(boardModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  deleteBoard(): void {
    if (!this.currentBoard) return;
    this.taskService.deleteBoard(this.currentBoard.id);
    if (this.boardModalRef) {
      this.boardModalRef.close();
    }
  }

  saveTask(): void {
    if (!this.currentBoard) return;
    this.formSubmitted = true;

    if (this.newTaskName.trim()) {
      if (this.editingTask) {
        // Update existing task
        const updatedTask: Task = {
          ...this.editingTask,
          name: this.newTaskName,
          description: this.newTaskDescription,
          priority: this.newTaskPriority,
          status: this.currentColumn,
          updatedAt: new Date()
        };
        this.taskService.updateTask(this.currentBoard.id, updatedTask);
      } else {
        // Add new task
        const newTask: Task = {
          id: Date.now().toString(),
          name: this.newTaskName,
          description: this.newTaskDescription,
          status: this.currentColumn,
          createdAt: new Date(),
          priority: this.newTaskPriority
        };
        this.taskService.addTask(this.currentBoard.id, newTask);
      }

      if (this.taskModalRef) {
        this.taskModalRef.close();
      }
    }
  }

  confirmDeleteTask(confirmModal: any, task: Task): void {
    this.editingTask = task;

    // Close task modal if it's open
    if (this.taskModalRef) {
      this.taskModalRef.close();
    }

    // Open confirm modal
    this.confirmModalRef = this.modalService.open(confirmModal, {
      centered: true,
      backdrop: 'static',
      size: 'sm'
    });

  }

  executeDeleteTask(): void {
    if (!this.currentBoard || !this.editingTask) return;

    this.taskService.deleteTask(this.currentBoard.id, this.editingTask.id);

    if (this.confirmModalRef) {
      this.confirmModalRef.close();
    }
  }

  moveTask(task: Task, targetStatus: string): void {
    if (!this.currentBoard) return;

    const updatedTask = { ...task, status: targetStatus };
    this.taskService.updateTask(this.currentBoard.id, updatedTask);
  }

  resetForm(): void {
    this.newTaskName = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'medium';
    this.editingTask = null;
    this.formSubmitted = false;
  }

  getColumnClass(status: string): string {
    switch(status) {
      case 'todo': return 'border-primary';
      case 'inProgress': return 'border-warning';
      case 'done': return 'border-success';
      default: return '';
    }
  }

  getTaskClass(task: Task): string {
    let classes = '';

    switch(task.priority) {
      case 'high':
        classes += 'border-danger ';
        break;
      case 'medium':
        classes += 'border-warning ';
        break;
      case 'low':
        classes += 'border-info ';
        break;
    }

    return classes;
  }
}
