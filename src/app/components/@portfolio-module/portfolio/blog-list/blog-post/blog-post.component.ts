import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe, NgIf} from '@angular/common';
import {BlogComment, BlogPost} from '../../../../../@core/interface/blog-post';
import {BlogService} from '../../../../../shared-service/@api-services/blog.service';
import {ConvertToStandardDateTimePipe} from '../../../../../@core/pipe/convert-to-standard-date-time.pipe';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UniqueValueGeneratorService} from '../../../../../shared-service/unique-value-generator.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../../../common-components/spinner/service/spinner.service';

@Component({
  selector: 'app-blog-post',
  imports: [
    DatePipe,
    ConvertToStandardDateTimePipe,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './blog-post.component.html',
  standalone: true,
  styleUrl: './blog-post.component.scss'
})
export class BlogPostComponent implements OnInit{
  blogForm: FormGroup = new FormGroup<any>({});

  post?: BlogPost;
  blogId: any;

  route: ActivatedRoute = inject(ActivatedRoute);
  blogService: BlogService = inject(BlogService);
  formBuilder: FormBuilder = inject(FormBuilder);
  uniqueValueGenerator: UniqueValueGeneratorService = inject(UniqueValueGeneratorService);
  toastrService: ToastrService = inject(ToastrService);
  spinnerService: SpinnerService = inject(SpinnerService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.blogId = params['postId'];
      this.blogService.getBlogById(this.blogId).subscribe(
        post => {
          this.post = post;
          console.log('this.post', this.post);
        }
      );

    });


    this.blogForm = this.formBuilder.group({
      comment: ['', Validators.required],
      authorName: ['', Validators.required],
    });
  }

  addComment(): void {
    if (this.blogForm.invalid) {
      return;
    }

    const commentContent = this.blogForm.value.comment;
    const authorName = this.blogForm.value.authorName;
    console.log('commentContent', commentContent);
    const newComment: BlogComment = {
      commentId: this.uniqueValueGenerator.generateRandomNumericIdWithTimestamp('C'),
      content: commentContent,
      author: {
        authorId: this.uniqueValueGenerator.generateRandomNumericIdWithTimestamp('A'),
        name: authorName,
        avatar: '',
        bio: ''
      },
      date: new Date(),
      likes: 0
    };

    const formData = {...this.post};
    if (newComment && formData && formData.comments) {
      formData?.comments?.push(newComment);
    }

    this.saveBlogData(formData);
  }

  saveBlogData(updatedData: any, isLike?: boolean): void {
    console.log('vsdsd', updatedData);
    this.blogService.updateBlog(this.blogId, updatedData).subscribe({
      next: () => {
        if (!isLike) {
          this.blogForm.reset();
          this.toastrService.success('Comment added successfully');
        }
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

  isInvalid(controlName: string): boolean {
    const control = this.blogForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  increaseLikes(commentId: any) {
    if (!this.post || !this.post.comments) return;

    const updatedComments = this.post.comments.map(comment =>
      comment.commentId === commentId ? { ...comment, likes: comment.likes + 1 } : comment
    );

    this.post = { ...this.post, comments: updatedComments };
    this.saveBlogData(this.post, true);
  }



}
