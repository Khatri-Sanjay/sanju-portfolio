import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {BlogService} from '../../../../shared-service/@api-services/blog.service';
import {SpinnerService} from '../../../../common-components/spinner/service/spinner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FileStorageService} from '../../../../shared-service/@api-services/file-storage.service';

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
export class AddEditBlogsComponent implements OnInit, OnDestroy{
  blogForm: FormGroup;
  selectedImage: File | null = null;
  editMode = false; // Flag to determine add or edit mode
  blogId!: string; // ID of the blog being edited
  imagePreviewUrl: string | null = null;

  blogService: BlogService = inject(BlogService);
  spinnerService: SpinnerService = inject(SpinnerService);
  toastrService: ToastrService = inject(ToastrService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  fileService: FileStorageService = inject(FileStorageService);

  constructor(private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: [null],
      tags: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true;
        this.blogId = params['id'];
        this.loadBlogData(this.blogId);
      }
    });
  }

  loadBlogData(id: string): void {
    this.blogService.getBlogById(id).subscribe((blog) => {
      this.blogForm.patchValue({
        title: blog.title,
        category: blog.category,
        description: blog.description,
        tags: blog.tags,
      });

      if (blog.imageUrl) {
        this.imagePreviewUrl = blog.imageUrl;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input?.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    // Validate file type
    if (!file.type.includes('image/')) {
      this.toastrService.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.toastrService.error('Image size should not exceed 5MB');
      return;
    }

    this.selectedImage = file;
    // Create preview URL
    this.imagePreviewUrl = URL.createObjectURL(file);
  }

  // Submit the form (add or edit user)
  async onSubmit(): Promise<void> {
    if (this.blogForm.invalid) {
      this.markFormControlsTouched();
      return;
    }

    this.spinnerService.show();

    try {
      // Upload image if selected
      if (this.selectedImage) {
        await this.uploadImage();
      }

      if (this.editMode && this.blogId) {
        this.updateBlog(this.blogId);
      } else {
        this.createBlog();
      }
    } catch (error) {
      this.handleError(error, 'Failed to process image.');
    }
  }

  private async uploadImage(): Promise<void> {
    if (!this.selectedImage) return;

    const path = `blog-images/${Date.now()}_${this.selectedImage.name}`;

    return new Promise((resolve, reject) => {
      this.fileService.uploadImage(this.selectedImage, path).subscribe({
        next: (downloadUrl) => {
          this.blogForm.patchValue({ imageUrl: downloadUrl });
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private createBlog(): void {
    this.blogService.createBlog(this.blogForm.value).subscribe({
      next: () => {
        this.toastrService.success('Blog created successfully');
        this.router.navigate(['admin/base/blogs']);
      },
      error: (error) => this.handleError(error, 'Failed to create blog.'),
      complete: () => this.spinnerService.hide()
    });
  }

  private updateBlog(userId: string): void {
    this.blogService.updateBlog(userId, this.blogForm.value).subscribe({
      next: () => {
        this.toastrService.success('Blog updated successfully');
        this.router.navigate(['admin/base/blogs']);
      },
      error: (error) => this.handleError(error, 'Failed to update user.'),
      complete: () => this.spinnerService.hide()
    });
  }

  private handleError(error: any, userMessage: string): void {
    console.error(error);
    this.toastrService.error(userMessage);
    this.spinnerService.hide();
  }

  private markFormControlsTouched(): void {
    Object.keys(this.blogForm.controls).forEach((key) => {
      const control = this.blogForm.get(key);
      control?.markAsTouched();
    });
  }

  ngOnDestroy() {
    // Clean up preview URL
    if (this.imagePreviewUrl && !this.imagePreviewUrl.includes('firebase')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
  }

}
