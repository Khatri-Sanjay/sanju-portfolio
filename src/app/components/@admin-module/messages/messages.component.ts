import {Component, inject, OnInit} from '@angular/core';
import {
  ActionButton,
  ColumnConfig, DynamicTableComponent,
  TableConfig
} from '../../../common-components/dynamic-table/dynamic-table.component';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../common-components/spinner/service/spinner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from '../../../shared-service/@api-services/message.service';

@Component({
  selector: 'app-messages',
  imports: [
    DynamicTableComponent
  ],
  templateUrl: './messages.component.html',
  standalone: true,
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit{

  messageService: MessageService = inject(MessageService);
  message: any;

  columns: ColumnConfig[] = [
    {
      key: 'sn',
      label: 'S.N',
      type: 'sn',
      width: '30px'
    },
    {
      key: 'messageId',
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
      width: '150px',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      sortable: true,
      filterable: true,
      filterType: 'text',
      width: '150px',
    },
    {
      key: 'message',
      label: 'Message',
      type: 'text'
    },
    {
      key: 'createdAt',
      label: 'Created at',
      type: 'date',
      sortable: true,
      filterable: true,
      filterType: 'date',
      width: '150px',
    },
    {
      key: 'updatedAt',
      label: 'Updated at',
      type: 'date',
      sortable: true,
      filterable: true,
      filterType: 'date',
      width: '150px',
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
    this.fetchMessages();
  }

  async fetchMessages(): Promise<void> {
    this.spinnerService.show();

    this.messageService.getAllMessages().subscribe({
      next: (messages) => {
        if (Array.isArray(messages)) {
          this.message = messages;
        } else {
          this.toastrService.error('Fetched message are in an invalid format.');
          this.message = [];
        }
        this.spinnerService.hide();
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
        this.toastrService.error('Failed to fetch messages: ' + err.message);
        this.message = [];
        this.spinnerService.hide();
      }
    });
  }

  onActionClick(event: { action: string, item: any }) {
    console.log('Action clicked:', event);
    if (event && event.action.toLowerCase() === 'add') {
      // this.router.navigate(['admin/base/add-blog']);
    }
    if (event && event.action.toLowerCase() === 'edit') {
      const itemId = event.item.messageId;  // Assuming item contains an 'id' field
      // this.router.navigate([`admin/base/edit-blog/${itemId}`]);
    }
    if (event && event.action.toLowerCase() === 'delete') {
      this.spinnerService.show();
      const itemId = event.item.messageId;  // Assuming item contains an 'id' field
      this.messageService.deleteMessage(itemId).subscribe({
        next: (res) => {
          this.toastrService.success('Delete Message Successfully.');
          this.spinnerService.hide();
          this.fetchMessages();
        },
        error: (err) => {
          console.error('Error while deleting Messages:', err);
          this.toastrService.error('Error while deleting Message: ' + err.message);
          this.spinnerService.hide();
        }
      });
    }
  }

}
