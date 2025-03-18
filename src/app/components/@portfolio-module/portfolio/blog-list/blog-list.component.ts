import {Component, inject, OnInit} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {BlogPost} from '../../../../@core/interface/blog-post';
import {BlogService} from '../../../../shared-service/@api-services/blog.service';
import {ConvertToStandardDateTimePipe} from '../../../../@core/pipe/convert-to-standard-date-time.pipe';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../../common-components/spinner/service/spinner.service';

@Component({
  selector: 'app-blog-list',
  imports: [
    DatePipe,
    ConvertToStandardDateTimePipe,
    NgClass
  ],
  templateUrl: './blog-list.component.html',
  standalone: true,
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit{
  posts: BlogPost[] = [];
  filterPost: BlogPost[] = [];

  blogService: BlogService = inject(BlogService);
  router: Router = inject(Router);
  toastrService: ToastrService = inject(ToastrService);
  spinnerService: SpinnerService = inject(SpinnerService);

  likedPosts: { [postId: string]: boolean } = {};
  animatingPosts: { [postId: string]: boolean } = {};

  searchTerm: string = '';

  ngOnInit(): void {
    this.spinnerService.show();
    this.blogService.getAllBlogs().subscribe(
      (res) => {
        this.posts = res;
        this.filterPost = res;
        console.log('Blogs received:', res);
        this.spinnerService.hide();
      },
      (error) => {
        this.spinnerService.hide();
        console.error('Error fetching blogs:', error);
      },
      () => {
        this.spinnerService.hide();
        console.log('Blog request completed');
      }
    );

  }

  onFilterPost(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  private applyFilters(): void {
    console.log('this.searchTerm', this.searchTerm);
    if (!this.searchTerm.trim()) {
      debugger
      this.filterPost = [...this.posts];
    } else {
      this.filterPost = this.posts.filter(post => {
        return post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  }

  navigateToPost(postId: string): void {
    this.router.navigate(['/portfolio/post', postId]);
  }

  // Handle double-click like animation
  handleDoubleClick(post: any): void {
    if (!this.likedPosts[post.postId]) {
      // Only increment like if not already liked
      post.likes = (post.likes || 0) + 1;
      this.likedPosts[post.postId] = true;

      // Show animation
      this.showHeartAnimation(post.postId);

      // Update on server
      this.updatePost(post);
    }
  }

  // Handle like button click
  handleLikeClick(post: any, event: Event): void {
    event.stopPropagation(); // Prevent double-click event from firing

    if (this.likedPosts[post.postId]) {
      // Unlike if already liked
      post.likes = Math.max(0, (post.likes || 1) - 1);
      this.likedPosts[post.postId] = false;
    } else {
      // Like if not already liked
      post.likes = (post.likes || 0) + 1;
      this.likedPosts[post.postId] = true;

      // Show smaller animation for button click
      this.showButtonAnimation(post.postId);
    }

    // Update on server
    this.updatePost(post);
  }

  // Show the heart animation for double-click
  showHeartAnimation(postId: string): void {
    this.animatingPosts[postId] = true;
    setTimeout(() => {
      this.animatingPosts[postId] = false;
    }, 1000); // Match this with animation duration
  }

  // Show smaller button animation for like button click
  showButtonAnimation(postId: string): void {
  }

  updatePost(updatedData: any): void {
    // this.spinnerService.show();
    this.blogService.updateBlog(updatedData.postId, updatedData).subscribe({
      next: () => {},
      error: (error) => this.handleError(error, 'Failed to update post.'),
      complete: () => this.spinnerService.hide()
    });
  }

  private handleError(error: any, userMessage: string): void {
    console.error(error);
    this.toastrService.error(userMessage);
    this.spinnerService.hide();
  }


}
