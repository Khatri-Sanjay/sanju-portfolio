import {Component, inject, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {BlogPost} from '../../../../@core/interface/blog-post';
import {BlogService} from '../../../../shared-service/@api-services/blog.service';

@Component({
  selector: 'app-blog-list',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './blog-list.component.html',
  standalone: true,
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit{
  posts: BlogPost[] = [];

  blogService: BlogService = inject(BlogService);
  router: Router = inject(Router);

  ngOnInit(): void {
    this.blogService.getPosts().subscribe(
      posts => this.posts = posts.posts
    );
  }

  navigateToPost(postId: string): void {
    // Navigate to the route programmatically
    this.router.navigate(['/portfolio/post', postId]);
  }
}
