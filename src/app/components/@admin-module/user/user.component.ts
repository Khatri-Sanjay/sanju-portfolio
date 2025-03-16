import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  ActionButton, ColumnConfig,
  DynamicTableComponent,
  TableConfig
} from '../../../common-components/dynamic-table/dynamic-table.component';
import {UserService} from '../../../shared-service/@api-services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../@core/interface/user';
import {SpinnerService} from '../../../common-components/spinner/service/spinner.service';

@Component({
  selector: 'app-user',
  imports: [
    MatButton,
    DynamicTableComponent,
    DynamicTableComponent,
  ],
  templateUrl: './user.component.html',
  standalone: true,
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{

  columns: ColumnConfig[] = [
    {
      key: 'sn',
      label: 'S.N.',
      type: 'sn',
      sortable: false
    },
    {
      key: 'id',
      label: 'ID',
      type: 'number',
      sortable: true,
      width: '80px',
      hidden: true
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      sortable: true,
      filterable: true,
      filterType: 'text',
      cellClass: 'font-bold'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      cellClass: 'font-bold'
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'text',
      cellClass: 'font-bold'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'text',
      sortable: true,
      filterable: true,
      filterType: 'text',
      cellClass: 'font-bold'
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'boolean',
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      type: 'date',
      sortable: true,
    },
    {
      key: 'updatedAt',
      label: 'Update Date',
      type: 'date',
      sortable: true,
    }
  ];

  tableConfig: TableConfig = {
    showHeader: true,
    showFooter: false,
    enableSearch: true,
    enableAdd: true,
    enableSort: true,
    enableFilter: true,
    enablePagination: true,
    enableRowSelection: true,
    enableExport: true,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    theme: 'default',
    selectionType: 'multi',
    exportFormats: ['excel', 'pdf', 'csv'],
    rowClass: (item) => item.status === 'inactive' ? 'bg-light' : '',
    showFirstLast: true,
    showPageJump: true,
    showPageInfo: true
  };

  actionButtons: ActionButton[] = [
    {
      label: 'Edit',
      icon: 'bi bi-pencil',
      class: 'btn btn-sm btn-outline-primary',
      action: 'edit',
    },
    {
      label: 'Delete',
      icon: 'bi bi-trash',
      class: 'btn btn-sm btn-outline-danger',
      action: 'delete',
      visible: (item) => item.role !== 'admin'
    },
    {
      label: 'View',
      icon: 'bi bi-eye',
      class: 'btn btn-sm btn-outline-primary',
      action: 'view'
    }
  ];

  bulkActions: ActionButton[] = [
    {
      label: 'Delete Selected',
      icon: 'bi bi-trash',
      class: 'btn btn-sm btn-outline-danger me-3',
      action: 'bulk-delete'
    },
    {
      label: 'Export Selected',
      icon: 'bi bi-download',
      class: 'btn btn-sm btn-outline-secondary me-3',
      action: 'bulk-export'
    }
  ];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private spinnerService: SpinnerService,
  ) {}

  onActionClick(event: { action: string, item: any }) {
    console.log('Action clicked:', event);
    if (event && event.action.toLowerCase() === 'add') {
      this.router.navigate(['admin/base/add-user']);
    }
    if (event && event.action.toLowerCase() === 'edit') {
      const itemId = event.item.id;  // Assuming item contains an 'id' field
      this.router.navigate([`admin/base/edit-user/${itemId}`]);
    }
  }

  onRowClick(item: any) {
    console.log('Row clicked:', item);
  }

  onFilterChange(filters: any) {
    console.log('Filters changed:', filters);
  }

  onSortChange(sort: { column: string, direction: string }) {
    console.log('Sort changed:', sort);
  }

  onPageChange(page: { page: number, pageSize: number }) {
    console.log('Page changed:', page);
  }

  onExportData(data: { format: string, data: any[] }) {
    console.log('Exporting data:', data);
  }

  onRowSelect(selectedRows: any[]) {
    console.log('Selected rows:', selectedRows);
  }

  users: User[] = [];


  async ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.spinnerService.show();
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.spinnerService.hide(); // Move inside the success block
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.spinnerService.hide(); // Ensure spinner is hidden even on error
      }
    });
  }

  navigateToCreate() {
    this.router.navigate(['/users/create']);
  }

  editUser(id: string) {
    this.router.navigate(['/users/edit', id]);
  }

  async deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await this.userService.deleteUser(id);
        this.users = this.users.filter(user => user.id !== id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

}
