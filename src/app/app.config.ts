import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getAuth, provideAuth} from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideToastr(),
    provideStoreDevtools(),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyC93GF3Tj0gOcFLr9hXeZ-tc0Sb48mePGU",
      authDomain: "personal-website-209f0.firebaseapp.com",
      databaseURL: "https://personal-website-209f0-default-rtdb.firebaseio.com",
      projectId: "personal-website-209f0",
      storageBucket: "personal-website-209f0.firebasestorage.app",
      messagingSenderId: "480898171820",
      appId: "1:480898171820:web:92ac5c4f8428a4723e3009",
      measurementId: "G-NYJJ1XLNT2"
    })),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
