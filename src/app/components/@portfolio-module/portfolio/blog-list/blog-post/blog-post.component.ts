import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {BlogPost} from '../../../../../@core/interface/blog-post';
import {BlogService} from '../../../../../shared-service/@api-services/blog.service';

@Component({
  selector: 'app-blog-post',
  imports: [
    DatePipe
  ],
  templateUrl: './blog-post.component.html',
  standalone: true,
  styleUrl: './blog-post.component.scss'
})
export class BlogPostComponent implements OnInit{
  post?: BlogPost;

  route: ActivatedRoute = inject(ActivatedRoute);
  blogService: BlogService = inject(BlogService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      debugger
      const id = params['postId'];
      this.blogService.getPostById(id).subscribe(
        post => this.post = post
      );
    });
  }
}
