import { Task } from "./task.interface";

export interface Board {
  id: string;
  name: string;
  createdAt: Date;
  tasks: Task[];
}
