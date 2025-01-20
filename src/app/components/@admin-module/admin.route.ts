import {Routes} from '@angular/router';
import {BaseComponent} from './@layout/base/base.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {BlogsComponent} from './blogs/blogs.component';
import {UserComponent} from './user/user.component';
import {AddEditUserComponent} from './user/add-edit-user/add-edit-user.component';

export const AdminRoute: Routes = [
  {
    path: 'base',
    component: BaseComponent,
    data: { title: 'Base' },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
      },
      {
        path: 'blogs',
        component: BlogsComponent,
        data: { title: 'Blog', breadcrumb: 'Blog' }
      },
      {
        path: 'users',
        component: UserComponent,
        data: { title: 'User List', breadcrumb: 'User' }
      },
      {
        path: 'add-user',
        component: AddEditUserComponent,
        data: { title: 'add', breadcrumb: 'Add User' }
      }
    ]
  },


];
