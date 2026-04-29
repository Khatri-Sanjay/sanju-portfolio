import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {isPlatformBrowser, NgClass, NgForOf, NgIf} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {BlogService} from '../../../../shared-service/@api-services/blog.service';
import {SpinnerService} from '../../../../common-components/spinner/service/spinner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FileStorageService} from '../../../../shared-service/@api-services/file-storage.service';
import {QuillModule} from 'ngx-quill';

@Component({
  selector: 'app-add-edit-blogs',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    FormsModule,
    QuillModule,
    NgForOf
  ],
  templateUrl: './add-edit-blogs.component.html',
  standalone: true,
  styleUrl: './add-edit-blogs.component.scss'
})
export class AddEditBlogsComponent implements OnInit, OnDestroy, AfterViewInit{
  blogForm: FormGroup;
  selectedImage: File | null = null;
  editMode = false; // Flag to determine add or edit mode
  blogId!: string; // ID of the blog being edited
  imagePreviewUrl: string | null = null;

  public quillConfig = {
    modules: {
      toolbar: [
        [{ font: [] }], // Font selection
        [{ size: ['small', false, 'large', 'huge'] }], // Font sizes
        ['bold', 'italic', 'underline', 'strike'], // Formatting options
        [{ color: [] }, { background: [] }], // Text color and background color
        [{ script: 'sub' }, { script: 'super' }], // Subscript & Superscript
        [{ header: 1 }, { header: 2 }, { header: 3 }], // Headings (H1, H2, H3)
        [{ list: 'ordered' }, { list: 'bullet' }], // Lists
        [{ indent: '-1' }, { indent: '+1' }], // Indentation
        [{ align: [] }], // Text alignment
        [{ direction: 'rtl' }], // Right-to-left text direction
        ['blockquote', 'code-block'], // Blockquote and Code Block
        ['link', 'image', 'video'], // Insert Links, Images, Videos
        ['table'], // Table feature
        ['mentions'], // Mentions feature (@users, #tags)
        ['undo', 'redo'], // Undo/Redo functionality
        ['clean'] // Remove formatting
      ],
      table: true,
      mention: {
        allowedChars: /^[A-Za-z\s]*$/,
        mentionDenotationChars: ["@", "#"],
        source: function (searchTerm: any, renderList: any) {
          const users = ["Sanjay", "Khatri", "Admin", "User", "Developer"];
          const matches = users.filter(user => user.toLowerCase().includes(searchTerm.toLowerCase()));
          renderList(matches);
        }
      }
    }
  };

  ngAfterViewInit() {
    // Add tooltips for each toolbar button
    const toolbarButtons = [
      { name: 'bold', title: 'Bold' },
      { name: 'italic', title: 'Italic' },
      { name: 'underline', title: 'Underline' },
      { name: 'strike', title: 'Strikethrough' },
      { name: 'color', title: 'Text Color' },
      { name: 'background', title: 'Background Color' },
      { name: 'sub', title: 'Subscript' },
      { name: 'super', title: 'Superscript' },
      { name: 'header', title: 'Heading' },
      { name: 'list', title: 'List' },
      { name: 'indent', title: 'Indent' },
      { name: 'align', title: 'Text Alignment' },
      { name: 'rtl', title: 'Right-to-left Text' },
      { name: 'blockquote', title: 'Blockquote' },
      { name: 'code-block', title: 'Code Block' },
      { name: 'link', title: 'Insert Link' },
      { name: 'image', title: 'Insert Image' },
      { name: 'video', title: 'Insert Video' },
      { name: 'table', title: 'Insert Table' },
      { name: 'mentions', title: 'Mentions' },
      { name: 'undo', title: 'Undo' },
      { name: 'redo', title: 'Redo' },
      { name: 'clean', title: 'Remove Formatting' }
    ];

    toolbarButtons.forEach(button => {
      const buttonElement = this.el.nativeElement.querySelector(`.ql-${button.name}`);
      if (buttonElement) {
        this.renderer.setAttribute(buttonElement, 'title', button.title);
      }
    });
  }

  blogService: BlogService = inject(BlogService);
  spinnerService: SpinnerService = inject(SpinnerService);
  toastrService: ToastrService = inject(ToastrService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  fileService: FileStorageService = inject(FileStorageService);

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2, private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      detailDescription: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: [''],
      tags: ['', Validators.required],
      likes: 0,
      comments: this.fb.array([])
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

    if (isPlatformBrowser(this.platformId)) {
      import('quill').then((Quill) => {
        (window as any).Quill = Quill;
      });
    }
  }

  loadBlogData(id: string): void {
    this.blogService.getBlogById(id).subscribe((blog) => {
      this.blogForm.patchValue({
        title: blog.title,
        category: blog.category,
        description: blog.description,
        detailDescription: blog.detailDescription,
        imageUrl: blog.imageUrl,
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags,
        likes: blog.likes
      });

      // Populate Comments Array
      if (blog.comments && blog.comments.length > 0) {
        const commentsArray = this.blogForm.get('comments') as FormArray;
        blog.comments.forEach((comment) => {
          console.log('blog', blog);
          console.log('comment', comment);
          commentsArray.push(
            this.fb.group({
              commentId: comment?.commentId,
              content: comment?.content,
              author: this.fb.group({
                authorId: comment.author?.authorId,
                name: comment.author?.name,
                avatar: comment.author?.avatar,
                bio: comment.author?.bio
              }),
              date: [new Date()],
              likes: comment.likes
            })
          );
        });
      }

      if (blog.imageUrl) {
        this.imagePreviewUrl = blog.imageUrl;
      }
    });
  }

  get comments() {
    return this.blogForm.get('comments') as FormArray;
  }

  addComment(): void {
    this.comments.push(
      this.fb.group({
        content: ['', Validators.required],
        authorName: ['', Validators.required]
      })
    );
  }

  removeComment(index: number): void {
    this.comments.removeAt(index);
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
    let formData = { ...this.blogForm.value };

    if (formData.tags) {
      formData.tags = formData.tags.split(',').map((tag: any) => tag.trim());
    }

    this.blogService.createBlog(formData).subscribe({
      next: () => {
        this.toastrService.success('Blog created successfully');
        this.router.navigate(['admin/base/blogs']);
        this.spinnerService.hide();
      },
      error: (error) => {
        this.handleError(error, 'Failed to create blog.');
        this.spinnerService.hide();
      },
    });
  }

  private updateBlog(blogId: string): void {
    let formData = { ...this.blogForm.value };

    if (formData.tags && typeof formData.tags === 'string') {
      formData.tags = formData.tags.split(',').map((tag: string) => tag.trim());
    }

    this.blogService.updateBlog(blogId, formData).subscribe({
      next: () => {
        this.toastrService.success('Blog updated successfully');
        this.router.navigate(['admin/base/blogs']);
        this.spinnerService.hide();
      },
      error: (error) => {
        this.handleError(error, 'Failed to update user.');
        this.spinnerService.hide();
      }
    });
  }

  private handleError(error: any, userMessage: string): void {
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
    if (this.imagePreviewUrl && !this.imagePreviewUrl.includes('firebase')) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
  }

  increaseLikes(index: number) {
    const commentsArray = this.blogForm.get('comments') as FormArray;
    const comment = commentsArray.at(index);
    const currentLikes = comment.get('likes')?.value || 0;
    comment.get('likes')?.setValue(currentLikes + 1);
  }

}
