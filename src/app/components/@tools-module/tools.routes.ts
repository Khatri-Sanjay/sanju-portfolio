import { Routes } from '@angular/router';

export const ToolsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../components/@tools-module/tools/tools.component').then(
        (m) => m.ToolsComponent
      ),
    data: { title: 'Tools Dashboard', description: 'Welcome to Tools' }
  },
  {
    path: 'drawing',
    loadComponent: () =>
      import('../@tools-module/tools/drawing-page/drawing-page.component')
        .then((m) => m.DrawingPageComponent),
    data: { title: 'Drawing Tool', description: 'Draw your thoughts' },
  },
  {
    path: 'todo',
    loadComponent: () =>
      import('../@tools-module/tools/to-do/task.component')
        .then((m) => m.TaskComponent),
    data: { title: 'Todo App', description: 'Manage your task' },
  },
];
