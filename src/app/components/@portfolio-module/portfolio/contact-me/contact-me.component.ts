import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from '../../../../shared-service/@api-services/message.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../../common-components/spinner/service/spinner.service';

@Component({
  selector: 'app-contact-me',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact-me.component.html',
  standalone: true,
  styleUrl: './contact-me.component.scss'
})
export class ContactMeComponent implements OnInit{

  messageForm: FormGroup = new FormGroup<any>({});

  spinnerService: SpinnerService = inject(SpinnerService);
  toastrService: ToastrService = inject(ToastrService);

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.messageForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      message: ['', Validators.required],
    })
  }


  sendMessage() {
    if (this.messageForm.invalid) {
      return;
    }

    const messageData = {
      name: this.messageForm.value.name,
      message: this.messageForm.value.message,
      email: this.messageForm.value.email
    }

    this.messageService.createMessage(messageData).subscribe({
      next: () => {
        this.toastrService.success('Message sent successfully');
        this.messageForm.reset();
      },
      error: (error) => this.handleError(error, 'Failed to send message.'),
      complete: () => this.spinnerService.hide()
    });

  }

  private handleError(error: any, userMessage: string): void {
    console.error(error);
    this.toastrService.error(userMessage);
    this.spinnerService.hide();
  }

}
