import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  ActionButton, ColumnConfig,
  DynamicTableComponent,
  TableConfig
} from '../../../common-components/dynamic-table/dynamic-table.component';
import {UserService} from '../../../shared-service/@api-services/user.service';
import {MatDialog} from '@angular/material/dialog';
import {AddEditUserComponent} from './add-edit-user/add-edit-user.component';
import {Router} from '@angular/router';

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

  userDataService: UserService = inject(UserService);

  data: any;


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
      key: 'status',
      label: 'Status',
      type: 'badge',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ]
    },
    {
      key: 'progress',
      label: 'Progress',
      type: 'progress',
      sortable: true,
      footer: {
        type: 'average',
        formatter: (values: any[]) => `${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}%`
      },
      filterable: true,
      filterType: 'text',
      cellClass: 'font-bold'
    },
    {
      key: 'date',
      label: 'Registration Date',
      type: 'date',
      sortable: true,
      filterable: true,
      filterType: 'dateRange',
      formatter: (value: string | number | Date) => new Date(value).toLocaleDateString()
    },
    {
      key: 'revenue',
      label: 'Revenue',
      type: 'currency',
      sortable: true,
      footer: {
        type: 'sum',
        formatter: (values) => `$${values.reduce((a, b) => a + b, 0).toLocaleString()}`
      }
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
    pageSizeOptions: [1, 2, 5, 10, 25, 50],
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
      visible: (item) => item.status !== 'inactive'
    },
    {
      label: 'Delete',
      icon: 'bi bi-trash',
      class: 'btn btn-sm btn-outline-danger',
      action: 'delete'
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
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userDataService.getData().subscribe((fetchedData) => {
      this.data = fetchedData;
    });
  }

  onRowClick(item: any) {
    console.log('Row clicked:', item);
  }

  onActionClick(event: { action: string, item: any }) {
    console.log('Action clicked:', event);
    if (event && event.action === 'Add') {
      this.router.navigate(['admin/base/add-user'])
      // this.dialog.open(AddEditUserComponent, {
      //   width: '80%',            // Custom width
      //   height: '80%',           // Custom height
      //   panelClass: 'custom-dialog-class', // Apply custom styling class
      //   backdropClass: 'custom-backdrop', // Custom backdrop class (optional)
      //   disableClose: true        // Disable closing the dialog by clicking outside
      // });

    }

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

}
