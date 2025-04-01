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
];
