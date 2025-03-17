export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
  password: string;
}
