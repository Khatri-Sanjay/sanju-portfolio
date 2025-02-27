import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, Subject, tap, from, throwError} from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
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
import {Messages} from '../../@core/interface/messages';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  static API = environment.baseApiUrl;

  protected getApi() {
    return MessageService.API;
  }

  http: HttpClient = inject(HttpClient);

  private readonly COLLECTION_NAME = 'messages';

  constructor(private firestore: Firestore) {}

  createMessage(messages: Messages): Observable<string> {
    try {
      const collectionRef = collection(this.firestore, this.COLLECTION_NAME);
      const docRef = doc(collectionRef);
      const messagesWithDate = {
        ...messages,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return from(setDoc(docRef, messagesWithDate)).pipe(
        map(() => docRef.id),
        catchError(error => {
          console.error('Error sending message:', error);
          return throwError(() => new Error(`Failed to send messages: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to create blog: ${error.message}`));
    }
  }

  getAllMessages(page: number = 1, itemsPerPage: number = 10): Observable<Messages[]> {
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

      return collectionData(queryRef, { idField: 'messageId' }).pipe(
        map(messages => messages as Messages[]),
        catchError(error => {
          console.error('Error fetching messages:', error);
          return throwError(() => new Error(`Failed to fetch messages: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to fetch messages: ${error.message}`));
    }
  }

  getMessagesById(messageId: string): Observable<Messages> {
    try {
      const docRef = doc(this.firestore, `${this.COLLECTION_NAME}/${messageId}`);
      return docData(docRef, { idField: 'postId' }).pipe(
        map(message => message as Messages),
        catchError(error => {
          console.error('Error fetching message:', error);
          return throwError(() => new Error(`Failed to fetch message: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to fetch message: ${error.message}`));
    }
  }

  updateMessage(messageId: string, updates: Partial<Messages>): Observable<void> {
    try {
      const docRef = doc(this.firestore, `${this.COLLECTION_NAME}/${messageId}`);
      const updatedMessage = {
        ...updates,
        updatedAt: new Date()
      };

      return from(updateDoc(docRef, updatedMessage)).pipe(
        catchError(error => {
          console.error('Error updating message:', error);
          return throwError(() => new Error(`Failed to update message: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to update message: ${error.message}`));
    }
  }

  deleteMessage(messageId: string): Observable<void> {
    try {
      const docRef = doc(this.firestore, `${this.COLLECTION_NAME}/${messageId}`);
      return from(deleteDoc(docRef)).pipe(
        catchError(error => {
          console.error('Error deleting message:', error);
          return throwError(() => new Error(`Failed to delete message: ${error.message}`));
        })
      );
    } catch (error: any) {
      return throwError(() => new Error(`Failed to delete message: ${error.message}`));
    }
  }

}
