import {Routes} from '@angular/router';
import {AuthGuard} from '../../@core/guard/auth.guard';

export const AuthRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [AuthGuard],
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
  },
];
