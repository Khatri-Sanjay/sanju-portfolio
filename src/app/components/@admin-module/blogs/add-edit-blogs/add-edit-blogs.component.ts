import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../shared-service/@api-services/user.service';
import {User} from '../../../../@core/interface/user';
import {NgClass, NgIf} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {BlogPost} from '../../../../@core/interface/blog-post';
import {BlogService} from '../../../../shared-service/@api-services/blog.service';
import {SpinnerService} from '../../../../common-components/spinner/service/spinner.service';
import {Router} from '@angular/router';

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
  blogForm: FormGroup;
  selectedImage: File | null = null;

  blogService: BlogService = inject(BlogService);
  spinnerService: SpinnerService = inject(SpinnerService);
  toastrService: ToastrService = inject(ToastrService);
  router: Router = inject(Router);

  imageUrl: string | undefined;

  constructor(private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: [null],
      tags: ['']
    });
  }

  // Handle image selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      this.selectedImage = input.files[0];
    }
  }

  // Handle form submission
  onSubmit(): void {
    if (this.blogForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.blogForm.controls).forEach(key => {
        const control = this.blogForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.spinnerService.show();

    const formValues = this.blogForm.value;

    // Clean and prepare the blog data
    const blogData: BlogPost = {
      postId: this.generatePostId(),
      title: formValues.title?.trim() || '',
      content: formValues.description?.trim() || '',
      category: formValues.category?.trim(),
      tags: formValues.tags ? formValues.tags.split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0) : [],
      imageUrl: this.imageUrl || formValues.image,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Additional validation
    if (!blogData.title || !blogData.content) {
      this.toastrService.error('Title and content are required');
      this.spinnerService.hide();
      return;
    }

    this.blogService.createBlog(blogData).subscribe({
      next: (docId) => {
        this.toastrService.success('Blog created successfully');
        this.spinnerService.hide();
        this.blogForm.reset();
        this.blogForm.markAsPristine();
        this.blogForm.markAsUntouched();
        this.router.navigate(['/blogs'])
      },
      error: (err) => {
        this.toastrService.error(`Failed to create blog: ${err.message}`);
        this.spinnerService.hide();
      }
    });
  }

  generatePostId(): string {
    return 'post_' + new Date().getTime();  // Example method: generate ID using the current timestamp
  }

}
