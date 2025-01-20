import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../shared-service/@api-services/user.service';
import {User} from '../../../../@core/interface/user';
import {NgClass, NgIf} from '@angular/common';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-blogs',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './add-edit-blogs.component.html',
  standalone: true,
  styleUrl: './add-edit-blogs.component.scss'
})
export class AddEditBlogsComponent {

}
