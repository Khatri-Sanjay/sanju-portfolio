import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../interface/task.interface';
import { Board } from '../interface/board.interface';
import {LocalStorageUtil} from '../../../../../../@core/utils/local-storage-utils';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'kanban_boards';

  private boardsSubject = new BehaviorSubject<Board[]>([]);
  boards$: Observable<Board[]> = this.boardsSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedBoards = LocalStorageUtil.getStorage().kanban_boards;
    if (storedBoards) {
      try {
        let boards: Board[];
        boards = JSON.parse(storedBoards);
        boards.forEach(board => {
          board.tasks.forEach(task => {
            task.createdAt = new Date(task.createdAt);
            if (task.updatedAt) {
              task.updatedAt = new Date(task.updatedAt);
            }
          });
        });
        this.boardsSubject.next(boards);
      } catch (e) {
        console.error('Error parsing stored boards', e);
        this.boardsSubject.next(this.getDefaultBoard());
      }
    } else {
      this.boardsSubject.next(this.getDefaultBoard());
    }
  }

  private saveToStorage(): void {
    const storage = LocalStorageUtil.getStorage();
    storage.kanban_boards = JSON.stringify(this.boardsSubject.value);
    LocalStorageUtil.setStorage(storage);
  }

  private getDefaultBoard(): Board[] {
    return [
      {
        id: 'default',
        name: 'My Tasks',
        createdAt: new Date(),
        tasks: [
          {
            id: 'task-1',
            name: 'Complete the report',
            description: 'Finish the quarterly report by the end of the day.',
            status: 'inProgress',
            priority: 'high',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'task-2',
            name: 'Respond to client emails',
            description: 'Reply to all pending client emails.',
            status: 'todo',
            priority: 'medium',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'task-3',
            name: 'Organize team meeting',
            description: 'Schedule and organize the team meeting for next week.',
            status: 'todo',
            priority: 'low',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'task-4',
            name: 'Update website content',
            description: 'Refresh the homepage with the latest news and updates.',
            status: 'inProgress',
            priority: 'medium',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'task-5',
            name: 'Fix bug in the application',
            description: 'Resolve the critical bug in the login process.',
            status: 'todo',
            priority: 'high',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    ];
  }

  // Board operations
  getBoards(): Board[] {
    return this.boardsSubject.value;
  }

  getBoardById(boardId: string): Board | undefined {
    return this.boardsSubject.value.find(board => board.id === boardId);
  }

  addBoard(boardName: string): Board {
    const newBoard: Board = {
      id: Date.now().toString(),
      name: boardName,
      createdAt: new Date(),
      tasks: []
    };

    const boards = [...this.boardsSubject.value, newBoard];
    this.boardsSubject.next(boards);
    this.saveToStorage();

    return newBoard;
  }

  updateBoard(board: Board): void {
    const boards = this.boardsSubject.value.map(b =>
      b.id === board.id ? board : b
    );
    this.boardsSubject.next(boards);
    this.saveToStorage();
  }

  deleteBoard(boardId: string): void {
    const boards = this.boardsSubject.value.filter(board => board.id !== boardId);
    if (boards.length === 0) {
      boards.push(this.getDefaultBoard()[0]);
    }
    this.boardsSubject.next(boards);
    this.saveToStorage();
  }

  getTasks(boardId: string, status: string): Task[] {
    const board = this.getBoardById(boardId);
    if (!board) return [];

    return board.tasks.filter(task => task.status === status);
  }

  addTask(boardId: string, task: Task): void {
    const boards = this.boardsSubject.value.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          tasks: [...board.tasks, task]
        };
      }
      return board;
    });

    this.boardsSubject.next(boards);
    this.saveToStorage();
  }

  updateTask(boardId: string, task: Task): void {
    const boards = this.boardsSubject.value.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          tasks: board.tasks.map(t => t.id === task.id ? task : t)
        };
      }
      return board;
    });

    this.boardsSubject.next(boards);
    this.saveToStorage();
  }

  deleteTask(boardId: string, taskId: string): void {
    const boards = this.boardsSubject.value.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          tasks: board.tasks.filter(task => task.id !== taskId)
        };
      }
      return board;
    });

    this.boardsSubject.next(boards);
    this.saveToStorage();
  }
}
