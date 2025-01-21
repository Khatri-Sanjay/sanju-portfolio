import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {
  // constructor(private storage: Storage) {}
  //
  // uploadImage(file: File, customPath?: string): Observable<{ progress: number; url: string | null }> {
  //   return new Observable(observer => {
  //     try {
  //       // Create unique filename
  //       const timestamp = new Date().getTime();
  //       const uniqueFileName = `${timestamp}_${file.name}`;
  //
  //       // Set storage path
  //       const basePath = customPath || 'blog-images';
  //       const storagePath = `${basePath}/${uniqueFileName}`;
  //
  //       // Create storage reference
  //       const storageRef = ref(this.storage, storagePath);
  //
  //       // Start upload
  //       const uploadTask = uploadBytesResumable(storageRef, file);
  //
  //       // Monitor upload progress
  //       uploadTask.on('state_changed',
  //         (snapshot) => {
  //           // Calculate and report progress
  //           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //           observer.next({ progress, url: null });
  //         },
  //         (error) => {
  //           // Handle errors
  //           console.error('Upload failed:', error);
  //           observer.error(error);
  //         },
  //         async () => {
  //           // Upload completed successfully
  //           try {
  //             const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
  //             observer.next({ progress: 100, url: downloadUrl });
  //             observer.complete();
  //           } catch (error) {
  //             observer.error('Failed to get download URL');
  //           }
  //         }
  //       );
  //     } catch (error) {
  //       observer.error('Upload initialization failed');
  //     }
  //   });
  // }
}
