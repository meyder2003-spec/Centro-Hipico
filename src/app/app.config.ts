import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importaciones de Firebase / Firestore
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Pega aquí el objeto que aparece en la pantalla de tu captura
const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "centro-hipico-4d7a9.firebaseapp.com",
  projectId: "centro-hipico-4d7a9",
  storageBucket: "centro-hipico-4d7a9.appspot.com",
  messagingSenderId: "44503837588",
  appId: "1:44503837588:web:f5665d3c622db46d68fd81"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};