import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgStyle} from '@angular/common';
import {environment} from '../../../../environment/environment';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgStyle
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  private secretKey = environment.LOCAL_STORAGE_KEY;

  private encryptedUsername = CryptoJS.AES.encrypt('admin@admin.com', this.secretKey).toString();
  private encryptedPassword = CryptoJS.AES.encrypt('admin1234', this.secretKey).toString();

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched) || false;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      try {
        // Simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Decrypt and validate credentials
        const decryptedUsername = this.decrypt(this.encryptedUsername);
        const decryptedPassword = this.decrypt(this.encryptedPassword);

        if (email === decryptedUsername && password === decryptedPassword) {
          this.router.navigate(['admin/base/dashboard']); // Navigate to dashboard
        } else {
        }
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
