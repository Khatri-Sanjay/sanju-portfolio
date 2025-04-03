export interface Task {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt?: Date;
}
