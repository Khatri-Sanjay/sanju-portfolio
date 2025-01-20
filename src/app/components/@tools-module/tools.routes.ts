import {Routes} from '@angular/router';

export const ToolsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../components/@tools-module/tools/tools.component').then(
        (m) => m.ToolsComponent
      ),
    data: {
      title: 'Dashboard',
      description: 'Welcome to Tools',
    },
  },
];
