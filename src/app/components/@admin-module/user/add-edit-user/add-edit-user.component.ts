import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {UserService} from '../../../../shared-service/@api-services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../../common-components/spinner/service/spinner.service';
import {EncryptDecryptService} from '../../../../shared-service/encrypt-decrypt.service';
import {User} from '../../../../@core/interface/user';

@Component({
  selector: 'app-add-edit-user',
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './add-edit-user.component.html',
  standalone: true,
  styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent implements OnInit{
  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;

  showPassword: boolean = false;
  isUpdatePasswordEnable: boolean = false;

  toastrService: ToastrService = inject(ToastrService);
  spinnerService: SpinnerService = inject(SpinnerService);
  encryptDecryptService: EncryptDecryptService = inject(EncryptDecryptService);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.detectEditModeAndLoadData();
  }

  // Create user form with default values and validators
  private createUserForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)]],
      role: ['user', Validators.required],
      isActive: [true],
      password: ['', Validators.required]
    });
  }

  // Determine if the component is in edit mode and load user data if necessary
  private detectEditModeAndLoadData(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this.loadUserData(this.userId);
    }
  }

  // Load user data for editing
  private loadUserData(userId: string): void {
    this.spinnerService.show();
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        if (user) {
          this.userForm.patchValue({
            ...user,
            password: this.encryptDecryptService.decrypt(user.password)
          });
          this.spinnerService.hide();
        } else {
          this.toastrService.error('User not found.');
          this.router.navigate(['admin/base/users']);
        }
      },
      error: (error) => this.handleError(error, 'Failed to load user details.'),
      complete: () => this.spinnerService.hide()
    });
  }

  // Submit the form (add or edit user)
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormControlsTouched();
      return;
    }

    this.spinnerService.show();

    if (this.isEditMode && this.userId) {
      this.updateUser(this.userId);
    } else {
      this.createUser();
    }
  }

  // Create a new user
  private createUser(): void {
    const user: User = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      phone: this.userForm.value.phone,
      role: this.userForm.value.role,
      isActive: this.userForm.value.isActive,
      password: this.encryptDecryptService.encrypt(this.userForm.value.password)
    };

    this.userService.createUser(user).subscribe({
      next: () => {
        this.toastrService.success('User created successfully');
        this.router.navigate(['admin/base/users']);
        this.spinnerService.hide();
      },
      error: (error) => {
        this.handleError(error, 'Failed to create user.');
        this.spinnerService.hide();
      },
    });
  }

  // Update an existing user
  private updateUser(userId: string): void {
    this.userService.updateUser(userId, this.userForm.value).subscribe({
      next: () => {
        this.toastrService.success('User updated successfully');
        this.router.navigate(['admin/base/users']);
        this.spinnerService.hide();
      },
      error: (error) => {
        this.handleError(error, 'Failed to update user.');
        this.spinnerService.hide();
      },
    });
  }

  // Handle errors consistently
  private handleError(error: any, userMessage: string): void {
    console.error(error);
    this.toastrService.error(userMessage);
    this.spinnerService.hide();
  }

  // Mark all form controls as touched to show validation errors
  private markFormControlsTouched(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  // Navigate back to the user list
  cancel(): void {
    this.router.navigate(['admin/base/users']);
  }
}
