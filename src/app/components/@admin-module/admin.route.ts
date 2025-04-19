import {Routes} from '@angular/router';
import {BaseComponent} from './@layout/base/base.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {BlogsComponent} from './blogs/blogs.component';
import {UserComponent} from './user/user.component';
import {AddEditUserComponent} from './user/add-edit-user/add-edit-user.component';
import {AddEditBlogsComponent} from './blogs/add-edit-blogs/add-edit-blogs.component';
import {AuthGuard} from '../../@core/guard/auth.guard';
import {MessagesComponent} from './messages/messages.component';
import {FinanceTrackerComponent} from './finance-tracker/finance-tracker.component';
import {LifeAchievementsComponent} from './achivement-list/achievement-list.component';

export const AdminRoute: Routes = [
  {
    path: 'base',
    component: BaseComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { title: 'Base' },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
      },
      {
        path: 'users',
        component: UserComponent,
        data: { title: 'User List', breadcrumb: 'User' }
      },
      {
        path: 'add-user',
        component: AddEditUserComponent,
        data: { title: 'Add User', breadcrumb: 'Add User' }
      },
      {
        path: 'edit-user/:id',
        component: AddEditUserComponent,
        data: { title: 'Edit User', breadcrumb: 'Edit User' }
      },
      {
        path: 'blogs',
        component: BlogsComponent,
        data: { title: 'Blog', breadcrumb: 'Blog' }
      },
      {
        path: 'add-blog',
        component: AddEditBlogsComponent,
        data: { title: 'Add Blog', breadcrumb: 'Add Blog' }
      },
      {
        path: 'edit-blog/:id',
        component: AddEditBlogsComponent,
        data: { title: 'Edit Blog', breadcrumb: 'Edit Blog' }
      },
      {
        path: 'messages',
        component: MessagesComponent,
        data: { title: 'Messages', breadcrumb: 'Messages' }
      },
      {
        path: 'finance-tracker',
        component: FinanceTrackerComponent,
        data: { title: 'Finance Tracker', breadcrumb: 'Finance Tracker' }
      },
      {
        path: 'achievement-list',
        component: LifeAchievementsComponent,
        data: { title: 'Achievement List', breadcrumb: 'Achievement List' }
      },
      {
        path: '404',
        loadComponent: () => import('../page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent),
        data: { title: '404 Page Not Found', breadcrumb: '' }
      },
      {
        path: '**',
        redirectTo: '404'
      }
    ]
  }


];
