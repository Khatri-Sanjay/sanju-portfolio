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
      key: 'author',
      label: 'Author',
      type: 'text',
      sortable: true,
      filterable: true,
      filterType: 'text',
    },
    {
      key: 'publishDate',
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

  ngOnInit(): void {
    // this.blogDataService.getBlogs().subscribe((fetchedData) => {
    //   this.data = fetchedData;
    // });
    this.fetchBlogs();
  }

  async fetchBlogs(): Promise<void> {
    this.blogDataService.GetAllBlogs().subscribe({
      next: (blogs) => {
        if (Array.isArray(blogs)) {
          this.data = blogs;
          console.log('Fetched blogs:', blogs);
        } else {
          console.error('Invalid data format:', blogs);
          this.toastrService.error('Fetched blogs are in an invalid format.');
          this.data = [];
        }
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
        this.toastrService.error('Failed to fetch blogs: ' + err.message);
        this.data = []; // Reset data in case of an error
      },
    });
  }

  onRowClick(item: any) {
    console.log('Row clicked:', item);
  }

  onActionClick(event: { action: string, item: any }) {
    console.log('Action clicked:', event);
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
