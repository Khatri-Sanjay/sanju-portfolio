import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-add-edit-user',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './add-edit-user.component.html',
  standalone: true,
  styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent {
  userForm: FormGroup;
  roles: string[] = ['Admin', 'Editor', 'Viewer'];

  constructor(
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Submitted', this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
