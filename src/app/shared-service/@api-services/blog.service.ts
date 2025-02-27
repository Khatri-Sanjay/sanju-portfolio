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
}
