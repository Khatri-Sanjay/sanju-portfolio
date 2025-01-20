import {Injectable} from '@angular/core';
import {User} from '../../@core/interface/user';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private data = [
    { id: 1, name: 'John Doe', status: 'active', progress: 75, date: '2024-01-01', revenue: 1500 },
    { id: 2, name: 'Jane Smith', status: 'pending', progress: 45, date: '2024-01-15', revenue: 2300 },
    { id: 3, name: 'Bob Johnson', status: 'inactive', progress: 90, date: '2024-01-20', revenue: 1800 },
    { id: 4, name: 'Alice Brown', status: 'active', progress: 60, date: '2024-02-10', revenue: 2000 },
    { id: 5, name: 'Charlie White', status: 'active', progress: 80, date: '2024-03-01', revenue: 2500 },
    { id: 6, name: 'Diana Green', status: 'pending', progress: 35, date: '2024-03-15', revenue: 1700 },
    { id: 7, name: 'Edward Black', status: 'inactive', progress: 95, date: '2024-03-20', revenue: 3100 },
    { id: 8, name: 'Fiona Gray', status: 'active', progress: 50, date: '2024-04-05', revenue: 2200 },
    { id: 9, name: 'George King', status: 'pending', progress: 40, date: '2024-04-18', revenue: 1900 },
    { id: 10, name: 'Hannah Queen', status: 'active', progress: 70, date: '2024-05-01', revenue: 2400 },
    { id: 11, name: 'Ian Walker', status: 'inactive', progress: 85, date: '2024-05-15', revenue: 2800 },
    { id: 12, name: 'Julia Carter', status: 'active', progress: 65, date: '2024-06-10', revenue: 3000 },
    { id: 13, name: 'Kevin Adams', status: 'pending', progress: 55, date: '2024-06-20', revenue: 2600 },
    { id: 14, name: 'Laura Morris', status: 'active', progress: 75, date: '2024-07-01', revenue: 3500 },
    { id: 15, name: 'Michael Scott', status: 'inactive', progress: 90, date: '2024-07-20', revenue: 4100 },
    { id: 16, name: 'Nancy Wood', status: 'pending', progress: 30, date: '2024-08-05', revenue: 1200 },
    { id: 17, name: 'Oscar Hall', status: 'active', progress: 60, date: '2024-08-15', revenue: 2000 },
    { id: 18, name: 'Paula Young', status: 'inactive', progress: 95, date: '2024-09-01', revenue: 4200 },
    { id: 19, name: 'Quentin Wright', status: 'pending', progress: 35, date: '2024-09-18', revenue: 1400 },
    { id: 20, name: 'Rachel Brooks', status: 'active', progress: 80, date: '2024-10-01', revenue: 3100 },
    { id: 21, name: 'Steve Turner', status: 'inactive', progress: 85, date: '2024-10-15', revenue: 2900 },
    { id: 22, name: 'Tina Lopez', status: 'active', progress: 75, date: '2024-11-01', revenue: 2700 },
    { id: 23, name: 'Uma Davis', status: 'pending', progress: 40, date: '2024-11-15', revenue: 1900 },
    { id: 24, name: 'Victor Evans', status: 'inactive', progress: 95, date: '2024-11-20', revenue: 3600 },
    { id: 25, name: 'Wendy Hill', status: 'active', progress: 50, date: '2024-12-01', revenue: 2500 },
    { id: 26, name: 'Xander Bell', status: 'pending', progress: 45, date: '2024-12-15', revenue: 2100 },
    { id: 27, name: 'Yara Jones', status: 'inactive', progress: 90, date: '2024-12-20', revenue: 3000 },
    { id: 28, name: 'Zane Ford', status: 'active', progress: 70, date: '2024-12-25', revenue: 3300 },
    { id: 29, name: 'Amanda Clark', status: 'pending', progress: 55, date: '2025-01-01', revenue: 2400 },
    { id: 30, name: 'Brian Lee', status: 'inactive', progress: 85, date: '2025-01-10', revenue: 3700 }
  ];


  getData(): Observable<any[]> {
    return of(this.data);
  }

  getAllUserByPage(pageNumber: number, pageSize: number) {
    // Mock data
    const allUsers = this.data;

    // Calculate pagination
    const startIndex = pageNumber * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = allUsers.slice(startIndex, endIndex);

    // Meta information for pagination
    const meta = {
      pageNumber,
      pageSize,
      totalItems: allUsers.length,
      totalPages: Math.ceil(allUsers.length / pageSize),
    };

    // Return as an observable to mimic an HTTP call
    return of({ data: paginatedData, meta });
  }
}
