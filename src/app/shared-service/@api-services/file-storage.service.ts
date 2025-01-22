import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes, uploadBytesResumable,
} from '@angular/fire/storage';
import {from, Observable, switchMap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {
  constructor(private storage: Storage) {}

  // file-storage.service.ts
  uploadImage(file: File | null, path: string): Observable<string> {
    if (!file) {
      return throwError(() => new Error('No file provided'));
    }

    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Observable<string>(observer => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress: ' + progress + '%');
        },
        (error) => {
          console.error('Upload error:', error);
          observer.error(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(storageRef);
            observer.next(downloadURL);
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        }
      );
    });
  }
}
