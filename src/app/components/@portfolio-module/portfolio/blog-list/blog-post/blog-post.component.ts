import {Component, inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe, NgIf} from '@angular/common';
import {BlogComment, BlogPost} from '../../../../../@core/interface/blog-post';
import {BlogService} from '../../../../../shared-service/@api-services/blog.service';
import {ConvertToStandardDateTimePipe} from '../../../../../@core/pipe/convert-to-standard-date-time.pipe';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UniqueValueGeneratorService} from '../../../../../shared-service/unique-value-generator.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../../../common-components/spinner/service/spinner.service';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {QuillViewComponent, QuillViewHTMLComponent} from 'ngx-quill';

@Component({
  selector: 'app-blog-post',
  imports: [
    DatePipe,
    ConvertToStandardDateTimePipe,
    ReactiveFormsModule,
    NgIf,
    QuillViewComponent,
    QuillViewHTMLComponent
  ],
  templateUrl: './blog-post.component.html',
  standalone: true,
  styleUrl: './blog-post.component.scss',
  animations: [
    trigger('likeAnimation', [
      state('inactive', style({
        transform: 'scale(1)',
        color: 'inherit'
      })),
      state('active', style({
        transform: 'scale(1)',
        color: 'inherit'
      })),
      transition('inactive => active', [
        animate('500ms ease-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.5)', color: '#ff2b56', offset: 0.3 }),
          style({ transform: 'scale(1.5) translateY(-10px)', color: '#ff2b56', offset: 0.5 }),
          style({ transform: 'scale(1.2) translateY(-5px)', color: '#ff2b56', offset: 0.7 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class BlogPostComponent implements OnInit{

  @Input() postId: any;

  blogForm: FormGroup = new FormGroup<any>({});

  post?: BlogPost;
  blogId: any;
  animationStates: {[key: string]: string} = {};
  likedComments: {[key: string]: boolean} = {};

  route: ActivatedRoute = inject(ActivatedRoute);
  blogService: BlogService = inject(BlogService);
  formBuilder: FormBuilder = inject(FormBuilder);
  uniqueValueGenerator: UniqueValueGeneratorService = inject(UniqueValueGeneratorService);
  toastrService: ToastrService = inject(ToastrService);
  spinnerService: SpinnerService = inject(SpinnerService);

  ngOnInit(): void {

    if (this.postId) {
      this.blogId = this.postId;
      this.blogService.getBlogById(this.blogId).subscribe(
        post => {
          this.post = post;
          console.log('this.post', this.post);
        }
      );
    } else {
      this.route.params.subscribe(params => {
        this.blogId = params['postId'];
        this.blogService.getBlogById(this.blogId).subscribe(
          post => {
            this.post = post;
            console.log('this.post', this.post);
          }
        );
      });
    }



    if (this.post && this.post.comments) {
      this.post.comments.forEach(comment => {
        this.animationStates[comment.commentId] = 'inactive';
        this.likedComments[comment.commentId] = false;
      });
    }

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

  increaseLikes(commentId: any, event: Event) {
    event.stopPropagation(); // Prevent double-click event from firing

    if (!this.post || !this.post.comments) return;

    const comment = this.post.comments.find(c => c.commentId === commentId);
    if (!comment) return;

    if (this.likedComments[commentId]) {
      // Unlike: User already liked this comment, so remove the like
      const updatedComments = this.post.comments.map(c =>
        c.commentId === commentId ? { ...c, likes: Math.max(0, c.likes - 1) } : c
      );

      this.post = { ...this.post, comments: updatedComments };
      this.likedComments[commentId] = false;
    } else {
      // Like: User hasn't liked this comment yet
      if(this.animationStates[commentId] !== 'active') {
        this.animationStates[commentId] = 'active';

        const updatedComments = this.post.comments.map(c =>
          c.commentId === commentId ? { ...c, likes: c.likes + 1 } : c
        );

        this.post = { ...this.post, comments: updatedComments };
        this.likedComments[commentId] = true;

        setTimeout(() => {
          this.animationStates[commentId] = 'inactive';
        }, 500);
      }
    }

    this.saveBlogData(this.post, true);
  }



}
