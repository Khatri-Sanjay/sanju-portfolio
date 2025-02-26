import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, Subject, tap, from, throwError} from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {Author, BlogComment, BlogPost} from '../../@core/interface/blog-post';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environment/environment';
import {ToastrService} from 'ngx-toastr';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentReference,
  QueryConstraint
} from '@angular/fire/firestore';

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
      description: `Angular 19 brings exciting new features and improvements to the popular framework. In this comprehensive guide, we'll explore the major updates and how to leverage them in your applications.

First, we'll look at the new control flow syntax that replaces NgIf and NgFor. Then, we'll dive into performance improvements and the new defer loading feature. We'll also cover best practices for migration from older versions.

The article includes practical examples and real-world use cases to help you understand these concepts better. Whether you're a beginner or an experienced developer, you'll find valuable insights to enhance your Angular development skills.`,
      author: this.authors[0],
      category: 'Development',
      tags: ['Angular', 'Web Development', 'JavaScript', 'TypeScript'],
      imageUrl: 'https://picsum.photos/seed/angular/800/400',
      readTime: 8,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      likes: 156,
      comments: [this.comments[0], this.comments[1]]
    },
    {
      postId: 'post2',
      title: 'Mastering CSS Grid: Advanced Layout Techniques',
      excerpt: 'Discover advanced CSS Grid techniques that will transform your web layouts. From responsive designs to complex grid patterns.',
      description: `CSS Grid has revolutionized web layout design, offering powerful capabilities for creating complex layouts with ease. In this in-depth guide, we'll explore advanced techniques that will take your CSS Grid skills to the next level.

We'll cover topics like grid template areas, auto-fit and auto-fill, and combining Grid with Flexbox. You'll learn how to create responsive layouts without media queries and handle complex grid patterns effectively.

The guide includes practical examples and common layout patterns you can use in your projects. We'll also discuss browser support and fallback strategies for older browsers.`,
      author: this.authors[1],
      category: 'Design',
      tags: ['CSS', 'Web Design', 'Frontend'],
      imageUrl: 'https://picsum.photos/seed/css/800/400',
      readTime: 10,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      likes: 234,
      comments: [this.comments[2]]
    },
    {
      postId: 'post3',
      title: 'The Future of AI in Web Development',
      excerpt: 'Explore how artificial intelligence is shaping the future of web development and what it means for developers.',
      description: `Artificial Intelligence is rapidly transforming the web development landscape. From AI-powered code completion to automated testing and deployment, the impact of AI on web development is profound and far-reaching.

In this article, we'll explore current AI applications in web development and look at emerging trends that will shape the future. We'll discuss tools like GitHub Copilot, AI-driven design systems, and automated optimization techniques.`,
      author: this.authors[2],
      category: 'Technology',
      tags: ['AI', 'Future Tech', 'Innovation'],
      imageUrl: 'https://picsum.photos/seed/ai/800/400',
      readTime: 12,
      updatedAt: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15'),
      likes: 312,
      comments: [this.comments[3]]
    }
  ];

  getPostById(postId: string): Observable<BlogPost> {
    const post = this.posts.find(p => p.postId === postId);
    if (!post) {
      return throwError(() => new Error('Post not found'));
    }
    return of(post).pipe(delay(300));
  }

  static API = environment.baseApiUrl;  // Assuming your API URL is set in environment

  protected getApi() {
    return BlogService.API;
  }

  http: HttpClient = inject(HttpClient);
  toastrService: ToastrService = inject(ToastrService);
  errorSubject = new Subject<HttpErrorResponse>();

  private readonly COLLECTION_NAME = 'blogs';

  constructor(private firestore: Firestore) {}

  createBlog(blog: BlogPost): Observable<string> {
    try {
      const collectionRef = collection(this.firestore, this.COLLECTION_NAME);
      const docRef = doc(collectionRef);
      const blogWithDates = {
        ...blog,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: []
      };

      return from(setDoc(docRef, blogWithDates)).pipe(
        map(() => docRef.id),
        catchError(error => {
          console.error('Error creating blog:', error);
          return throwError(() => new Error(`Failed to create blog: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to create blog: ${error.message}`));
    }
  }

  getAllBlogs(page: number = 1, itemsPerPage: number = 10): Observable<BlogPost[]> {
    try {
      const collectionRef = collection(this.firestore, this.COLLECTION_NAME);
      const queryConstraints: QueryConstraint[] = [
        orderBy('createdAt', 'desc'),
        limit(itemsPerPage)
      ];

      if (page > 1) {
        queryConstraints.push(startAfter((page - 1) * itemsPerPage));
      }

      const queryRef = query(collectionRef, ...queryConstraints);

      return collectionData(queryRef, { idField: 'postId' }).pipe(
        map(blogs => blogs as BlogPost[]),
        catchError(error => {
          console.error('Error fetching blogs:', error);
          return throwError(() => new Error(`Failed to fetch blogs: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to fetch blogs: ${error.message}`));
    }
  }

  getBlogById(postId: string): Observable<BlogPost> {
    try {
      const docRef = doc(this.firestore, `${this.COLLECTION_NAME}/${postId}`);
      return docData(docRef, { idField: 'postId' }).pipe(
        map(blog => blog as BlogPost),
        catchError(error => {
          console.error('Error fetching blog:', error);
          return throwError(() => new Error(`Failed to fetch blog: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to fetch blog: ${error.message}`));
    }
  }

  // Update a blog post
  updateBlog(postId: string, updates: Partial<BlogPost>): Observable<void> {
    try {
      const docRef = doc(this.firestore, `${this.COLLECTION_NAME}/${postId}`);
      const updatedBlog = {
        ...updates,
        updatedAt: new Date()
      };

      return from(updateDoc(docRef, updatedBlog)).pipe(
        catchError(error => {
          console.error('Error updating blog:', error);
          return throwError(() => new Error(`Failed to update blog: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to update blog: ${error.message}`));
    }
  }

  // Delete a blog post
  deleteBlog(postId: string): Observable<void> {
    try {
      const docRef = doc(this.firestore, `${this.COLLECTION_NAME}/${postId}`);
      return from(deleteDoc(docRef)).pipe(
        catchError(error => {
          console.error('Error deleting blog:', error);
          return throwError(() => new Error(`Failed to delete blog: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to delete blog: ${error.message}`));
    }
  }

  // Search blogs by tag
  searchBlogsByTag(tag: string): Observable<BlogPost[]> {
    try {
      const collectionRef = collection(this.firestore, this.COLLECTION_NAME);
      const queryRef = query(collectionRef,
        where('tags', 'array-contains', tag),
        orderBy('createdAt', 'desc')
      );

      return collectionData(queryRef, { idField: 'postId' }).pipe(
        map(blogs => blogs as BlogPost[]),
        catchError(error => {
          console.error('Error searching blogs:', error);
          return throwError(() => new Error(`Failed to search blogs: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to search blogs: ${error.message}`));
    }
  }

  // Add a comment to a blog post
  // addComment(postId: string, comment: Comment): Observable<void> {
  //   try {
  //     const docRef = doc(this.firestore, `${this.COLLECTION_NAME}/${postId}`);
  //     return from(this.getBlogById(postId)).pipe(
  //       map(blog => {
  //         const comments = blog.comments || [];
  //         const newComment = {
  //           ...comment,
  //           id: Math.random().toString(36).substr(2, 9),
  //           createdAt: new Date()
  //         };
  //         comments.push(newComment);
  //         return updateDoc(docRef, { comments });
  //       }),
  //       catchError(error => {
  //         console.error('Error adding comment:', error);
  //         return throwError(() => new Error(`Failed to add comment: ${error.message}`));
  //       })
  //     );
  //   } catch (error: any) {
  //     return throwError(() => new Error(`Failed to add comment: ${error.message}`));
  //   }
  // }
  //
  // // Like/Unlike a blog post
  // toggleLike(postId: string): Observable<void> {
  //   try {
  //     const docRef = doc(this.firestore, `${this.COLLECTION_NAME}/${postId}`);
  //     return from(this.getBlogById(postId)).pipe(
  //       map(blog => {
  //         const currentLikes = blog.likes || 0;
  //         return updateDoc(docRef, { likes: currentLikes + 1 });
  //       }),
  //       catchError(error => {
  //         console.error('Error toggling like:', error);
  //         return throwError(() => new Error(`Failed to toggle like: ${error.message}`));
  //       })
  //     );
  //   } catch (error: any) {
  //     return throwError(() => new Error(`Failed to toggle like: ${error.message}`));
  //   }
  // }
}
