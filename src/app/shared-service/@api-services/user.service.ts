import {Injectable} from '@angular/core';
import {
  Firestore,
  collection,
  updateDoc,
  deleteDoc,
  doc,
  query,
  setDoc,
  docData,
  QueryConstraint,
  orderBy,
  limit,
  collectionData, startAfter
} from '@angular/fire/firestore';
import {User} from '../../@core/interface/user';
import {map, catchError, Observable, throwError, from} from 'rxjs';
import {BlogPost} from '../../@core/interface/blog-post';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private USER_COLLECTION_NAME = 'users';

  constructor(private firestore: Firestore) {
  }

  createUser(user: User): Observable<string> {
    try {
      const collectionRef = collection(this.firestore, this.USER_COLLECTION_NAME);
      const docRef = doc(collectionRef);
      const userWithDate = {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return from(setDoc(docRef, userWithDate)).pipe(
        map(() => docRef.id),
        catchError(error => {
          console.error('Error creating user:', error);
          return throwError(() => new Error(`Failed to create user: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to create user: ${error.message}`));
    }
  }

  getAllUsers(page: number = 1, itemsPerPage: number = 10): Observable<User[]> {
    try {
      const collectionRef = collection(this.firestore, this.USER_COLLECTION_NAME);
      const queryConstraints: QueryConstraint[] = [
        orderBy('createdAt', 'desc'),
        limit(itemsPerPage)
      ];

      // If not first page, add startAfter constraint
      if (page > 1) {
        // Note: You'll need to implement proper pagination using the last document
        // from the previous page as the starting point
        queryConstraints.push(startAfter((page - 1) * itemsPerPage));
      }

      const queryRef = query(collectionRef, ...queryConstraints);

      return collectionData(queryRef, {idField: 'id'}).pipe(
        map(blogs => blogs as User[]),
        catchError(error => {
          console.error('Error fetching users:', error);
          return throwError(() => new Error(`Failed to fetch users: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to fetch users: ${error.message}`));
    }
  }

  // Get a single blog post by ID
  getUserById(postId: string): Observable<User> {
    try {
      const docRef = doc(this.firestore, `${this.USER_COLLECTION_NAME}/${postId}`);
      return docData(docRef, { idField: 'postId' }).pipe(
        map(blog => blog as User),
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
  updateUser(id: string, updates: Partial<User>): Observable<void> {
    try {
      const docRef = doc(this.firestore, `${this.USER_COLLECTION_NAME}/${id}`);
      const updatedBlog = {
        ...updates,
        updatedAt: new Date()
      };

      return from(updateDoc(docRef, updatedBlog)).pipe(
        catchError(error => {
          console.error('Error updating user:', error);
          return throwError(() => new Error(`Failed to update user: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to update user: ${error.message}`));
    }
  }

  // Delete a user post
  deleteUser(id: string): Observable<void> {
    try {
      const docRef = doc(this.firestore, `${this.USER_COLLECTION_NAME}/${id}`);
      return from(deleteDoc(docRef)).pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          return throwError(() => new Error(`Failed to delete user: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to delete blog: ${error.message}`));
    }
  }


}
