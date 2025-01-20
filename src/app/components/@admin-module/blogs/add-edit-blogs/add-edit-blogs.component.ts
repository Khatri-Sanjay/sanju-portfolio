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
      return;
    }
    this.spinnerService.show();

    const formValues = this.blogForm.value;

    // Map form data to the BlogPost interface
    const blogData: BlogPost = {
      postId: this.generatePostId(),
      title: formValues.title,
      content: formValues.description,
      category: formValues.category,
      tags: formValues.tags.split(',').map((tag: string) => tag.trim()),
      imageUrl: formValues.image,
      publishDate: new Date(),
    };

    this.blogService.CreateBlog(blogData).subscribe({
      next: (response) => {
        this.toastrService.success('Blog created successfully with ID:' + response?.name, 'Success');
        this.spinnerService.hide();
        this.blogForm.reset();
        this.router.navigate(['admin/base/blogs']);
      },
      error: (err) => {
        this.toastrService.error('Failed to create blog: ' + err.message);
        this.spinnerService.hide();
      }
    });
  }

  generatePostId(): string {
    return 'post_' + new Date().getTime();  // Example method: generate ID using the current timestamp
  }

}
