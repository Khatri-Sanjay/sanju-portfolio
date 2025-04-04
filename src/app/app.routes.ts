import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio',
    pathMatch: 'full'
  },
  {
    path: 'portfolio',
    loadChildren: () =>
      import('../app/components/@portfolio-module/portfolio.routes').then(
        (m) => m.PortfolioRoutes
      ),
    data: { preload: true, title: 'Portfolio' }
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../app/components/@auth-module/auth.routes').then(
        (m) => m.AuthRoutes
      ),
    data: { preload: true, title: 'Authentication' }
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('../app/components/@admin-module/admin.route').then(
        (m) => m.AdminRoute
      ),
    /*canActivate: [AdminGuard],*/
    data: { preload: true, title: 'Admin Panel' }
  },
  {
    path: 'tools',
    loadChildren: () =>
      import('../app/components/@tools-module/tools.routes').then(
        (m) => m.ToolsRoutes
      ),
    /*canActivate: [AdminGuard],*/
    data: { preload: true, title: 'Tools Page' }
  },
  {
    path: '404',
    loadComponent: () => import('../app/components/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent),
    data: { title: '404 Page Not Found', breadcrumb: '' }
  },
  {
    path: '**',
    resolve: {
      logRoute: () => {
        console.error('Unknown route accessed!');
        return null;
      },
    },
    redirectTo: '404',
    pathMatch: 'full'
  }

];
