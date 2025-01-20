import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {Author, BlogComment, BlogPost} from '../../@core/interface/blog-post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private authors: Author[] = [
    {
      authorId: 'auth1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      bio: 'Senior Tech Writer | Software Engineer | Coffee Enthusiast'
    },
    {
      authorId: 'auth2',
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      bio: 'Digital Marketing Expert | Content Creator | Travel Blogger'
    },
    {
      authorId: 'auth3',
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      bio: 'UI/UX Designer | Creative Director | Photography Lover'
    },
    {
      authorId: 'auth4',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Tech Reviewer | Gadget Enthusiast | YouTube Creator'
    }
  ];

  private comments: BlogComment[] = [
    {
      commentId: 'com1',
      content: 'Great article! Really helped me understand the concept better.',
      author: this.authors[1],
      date: new Date('2024-01-15'),
      likes: 12
    },
    {
      commentId: 'com2',
      content: 'Thanks for sharing these insights. Would love to see more content like this.',
      author: this.authors[2],
      date: new Date('2024-01-16'),
      likes: 8
    },
    {
      commentId: 'com3',
      content: 'This is exactly what I was looking for. Very well explained!',
      author: this.authors[3],
      date: new Date('2024-01-17'),
      likes: 15
    },
    {
      commentId: 'com4',
      content: 'Interesting perspective. I never thought about it this way before.',
      author: this.authors[0],
      date: new Date('2024-01-18'),
      likes: 10
    }
  ];

  private posts: BlogPost[] = [
    {
      postId: 'post1',
      title: 'Getting Started with Angular 19: A Complete Guide',
      excerpt: 'Learn about the latest features and improvements in Angular 19. This comprehensive guide covers everything you need to know.',
      content: `Angular 19 brings exciting new features and improvements to the popular framework. In this comprehensive guide, we'll explore the major updates and how to leverage them in your applications.

First, we'll look at the new control flow syntax that replaces NgIf and NgFor. Then, we'll dive into performance improvements and the new defer loading feature. We'll also cover best practices for migration from older versions.

The article includes practical examples and real-world use cases to help you understand these concepts better. Whether you're a beginner or an experienced developer, you'll find valuable insights to enhance your Angular development skills.`,
      author: this.authors[0],
      category: 'Development',
      tags: ['Angular', 'Web Development', 'JavaScript', 'TypeScript'],
      imageUrl: 'https://picsum.photos/seed/angular/800/400',
      readTime: 8,
      publishDate: new Date('2024-01-10'),
      likes: 156,
      comments: [this.comments[0], this.comments[1]]
    },
    {
      postId: 'post2',
      title: 'Mastering CSS Grid: Advanced Layout Techniques',
      excerpt: 'Discover advanced CSS Grid techniques that will transform your web layouts. From responsive designs to complex grid patterns.',
      content: `CSS Grid has revolutionized web layout design, offering powerful capabilities for creating complex layouts with ease. In this in-depth guide, we'll explore advanced techniques that will take your CSS Grid skills to the next level.

We'll cover topics like grid template areas, auto-fit and auto-fill, and combining Grid with Flexbox. You'll learn how to create responsive layouts without media queries and handle complex grid patterns effectively.

The guide includes practical examples and common layout patterns you can use in your projects. We'll also discuss browser support and fallback strategies for older browsers.`,
      author: this.authors[1],
      category: 'Design',
      tags: ['CSS', 'Web Design', 'Frontend'],
      imageUrl: 'https://picsum.photos/seed/css/800/400',
      readTime: 10,
      publishDate: new Date('2024-01-12'),
      likes: 234,
      comments: [this.comments[2]]
    },
    {
      postId: 'post3',
      title: 'The Future of AI in Web Development',
      excerpt: 'Explore how artificial intelligence is shaping the future of web development and what it means for developers.',
      content: `Artificial Intelligence is rapidly transforming the web development landscape. From AI-powered code completion to automated testing and deployment, the impact of AI on web development is profound and far-reaching.

In this article, we'll explore current AI applications in web development and look at emerging trends that will shape the future. We'll discuss tools like GitHub Copilot, AI-driven design systems, and automated optimization techniques.`,
      author: this.authors[2],
      category: 'Technology',
      tags: ['AI', 'Future Tech', 'Innovation'],
      imageUrl: 'https://picsum.photos/seed/ai/800/400',
      readTime: 12,
      publishDate: new Date('2024-01-15'),
      likes: 312,
      comments: [this.comments[3]]
    }
  ];

  // Get all blog posts with optional pagination
  getPosts(page: number = 1, limit: number = 10): Observable<{
    posts: BlogPost[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = this.posts.slice(startIndex, endIndex);
    const total = this.posts.length;
    const totalPages = Math.ceil(total / limit);

    return of({
      posts: paginatedPosts,
      total,
      currentPage: page,
      totalPages
    }).pipe(delay(500)); // Simulate network delay
  }

  // Get a single post by ID
  getPostById(postId: string): Observable<BlogPost> {
    const post = this.posts.find(p => p.postId === postId);
    if (!post) {
      return throwError(() => new Error('Post not found'));
    }
    return of(post).pipe(delay(300));
  }

  // Get recent posts
  getRecentPosts(count: number = 5): Observable<BlogPost[]> {
    return of(
      [...this.posts]
        .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
        .slice(0, count)
    ).pipe(delay(300));
  }

  // Get posts by category
  getPostsByCategory(category: string): Observable<BlogPost[]> {
    return of(
      this.posts.filter(post =>
        post.category.toLowerCase() === category.toLowerCase()
      )
    ).pipe(delay(300));
  }

  // Get posts by author
  getPostsByAuthor(authorId: string): Observable<BlogPost[]> {
    return of(
      this.posts.filter(post => post.author.authorId === authorId)
    ).pipe(delay(300));
  }

  // Search posts
  searchPosts(query: string): Observable<BlogPost[]> {
    const searchTerm = query.toLowerCase();
    return of(
      this.posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    ).pipe(delay(500));
  }

  // Get all categories with post count
  getCategories(): Observable<{ category: string; count: number }[]> {
    const categories = this.posts.reduce((acc, post) => {
      const category = post.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return of(
      Object.entries(categories).map(([category, count]) => ({
        category,
        count
      }))
    );
  }

  // Add a new comment to a post
  addComment(postId: string, comment: Omit<BlogComment, 'commentId' | 'date' | 'likes'>): Observable<BlogComment> {
    const post = this.posts.find(p => p.postId === postId);
    if (!post) {
      return throwError(() => new Error('Post not found'));
    }

    const newComment: BlogComment = {
      ...comment,
      commentId: `com${Date.now()}`,
      date: new Date(),
      likes: 0
    };

    post.comments.push(newComment);
    return of(newComment).pipe(delay(300));
  }

  // Like/Unlike a post
  togglePostLike(postId: string): Observable<{ likes: number }> {
    const post = this.posts.find(p => p.postId === postId);
    if (!post) {
      return throwError(() => new Error('Post not found'));
    }

    post.likes += 1; // In a real app, you'd toggle between like/unlike
    return of({ likes: post.likes }).pipe(delay(300));
  }

  // Get all authors
  getAuthors(): Observable<Author[]> {
    return of(this.authors).pipe(delay(300));
  }

  // Get popular posts (by likes)
  getPopularPosts(count: number = 5): Observable<BlogPost[]> {
    return of(
      [...this.posts]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, count)
    ).pipe(delay(300));
  }

  // Get related posts (posts with similar tags)
  getRelatedPosts(postId: string, count: number = 3): Observable<BlogPost[]> {
    const currentPost = this.posts.find(p => p.postId === postId);
    if (!currentPost) {
      return throwError(() => new Error('Post not found'));
    }

    return of(
      this.posts
        .filter(post => post.postId !== postId)
        .map(post => ({
          post,
          commonTags: post.tags.filter(tag =>
            currentPost.tags.includes(tag)
          ).length
        }))
        .sort((a, b) => b.commonTags - a.commonTags)
        .map(({ post }) => post)
        .slice(0, count)
    ).pipe(delay(300));
  }

  getBlogs(): Observable<any[]> {
    const blogs = [
      { id: 1, title: 'Angular Basics', author: 'John Doe', date: '2025-01-10' },
      { id: 2, title: 'Getting Started with RxJS', author: 'Jane Smith', date: '2025-01-12' },
      { id: 3, title: 'State Management with NgRx', author: 'Mike Johnson', date: '2025-01-15' },
      { id: 4, title: 'Building Reusable Components', author: 'Emily Davis', date: '2025-01-16' },
    ];
    return of(blogs); // Simulates an API response as an observable
  }
}
