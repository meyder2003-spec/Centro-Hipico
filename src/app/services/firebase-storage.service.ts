import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  private app = initializeApp(environment.firebaseConfig);
  private storage = getStorage(this.app);

  async subirTarjeta(file: File): Promise<string> {
    // Crear un nombre único para el archivo escaneado
    const nombreArchivo = `tarjetas/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, nombreArchivo);

    // Subir imagen a Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);

    // Obtener y devolver la URL pública
    return await getDownloadURL(snapshot.ref);
  }
}