import {Component, inject, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  ActionButton,
  ColumnConfig,
  DynamicTableComponent,
  TableConfig
} from '../../../common-components/dynamic-table/dynamic-table.component';
import {BlogService} from '../../../shared-service/@api-services/blog.service';
import {BreadcrumbsComponent} from '../../../common-components/breadcrumbs/breadcrumbs.component';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../common-components/spinner/service/spinner.service';
import {ActivatedRoute, Router} from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

@Component({
  selector: 'app-blogs',
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    NgIf,
    SlicePipe,
    DynamicTableComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './blogs.component.html',
  standalone: true,
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit{
  blogDataService: BlogService = inject(BlogService);
  data: any;

  columns: ColumnConfig[] = [
    {
      key: 'sn',
      label: 'S.N',
      type: 'sn',
      width: '80px'
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
      key: 'title',
      label: 'Blog Title',
      type: 'text',
      sortable: true,
      filterable: true,
      filterType: 'text',
      cellClass: 'font-bold'
    },
    {
      key: 'image',
      label: 'Image',
      type: 'image'
    },
    {
      key: 'createdAt',
      label: 'Created at',
      type: 'date',
      sortable: true,
      filterable: true,
      filterType: 'date',
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
    enableRowSelection: false,
    enableExport: false,
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

  toastrService: ToastrService = inject(ToastrService);
  spinnerService: SpinnerService = inject(SpinnerService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchBlogs();
  }

  async fetchBlogs(): Promise<void> {
    this.spinnerService.show();

    this.blogDataService.getAllBlogs().subscribe({
      next: (blogs) => {
        if (Array.isArray(blogs)) {
          this.data = blogs;
        } else {
          this.toastrService.error('Fetched blogs are in an invalid format.');
          this.data = [];
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
        this.toastrService.error('Failed to fetch blogs: ' + err.message);
        this.data = [];
        this.spinnerService.hide();
      }
    });
  }

  onRowClick(item: any) {
    console.log('Row clicked:', item);
  }

  onActionClick(event: { action: string, item: any }) {
    if (event && event.action === 'Add') {
      this.router.navigate(['admin/base/add-blog']);
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
