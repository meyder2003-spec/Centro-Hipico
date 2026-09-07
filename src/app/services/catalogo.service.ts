import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable } from 'rxjs';

export interface Caballo {
  id?: string;
  nombre: string;
  raza: string;
  edad: number;
  imagenUrl?: string;
  pdfUrl?: string;
  pdfPath?: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  getCaballos(): Observable<Caballo[]> {
    const caballosRef = collection(this.firestore, 'caballos');
    return collectionData(caballosRef, { idField: 'id' }) as Observable<Caballo[]>;
  }

  async subirArchivo(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async agregarCaballo(caballo: Caballo, pdfFile?: File): Promise<void> {
    if (pdfFile) {
      const pdfPath = `tarjetas_pdf/${Date.now()}_${pdfFile.name}`;
      const storageRef = ref(this.storage, pdfPath);
      await uploadBytes(storageRef, pdfFile);
      caballo.pdfUrl = await getDownloadURL(storageRef);
      caballo.pdfPath = pdfPath;
    }
    const caballosRef = collection(this.firestore, 'caballos');
    await addDoc(caballosRef, caballo);
  }

  async actualizarCaballo(id: string, caballo: Partial<Caballo>, nuevoPdfFile?: File): Promise<void> {
    const caballoDoc = doc(this.firestore, `caballos/${id}`);
    if (nuevoPdfFile) {
      const pdfPath = `tarjetas_pdf/${Date.now()}_${nuevoPdfFile.name}`;
      const storageRef = ref(this.storage, pdfPath);
      await uploadBytes(storageRef, nuevoPdfFile);
      caballo.pdfUrl = await getDownloadURL(storageRef);
      caballo.pdfPath = pdfPath;
    }
    await updateDoc(caballoDoc, caballo);
  }

  async eliminarCaballo(caballo: Caballo): Promise<void> {
    if (caballo.id) {
      const caballoDoc = doc(this.firestore, `caballos/${caballo.id}`);
      await deleteDoc(caballoDoc);
      if (caballo.pdfPath) {
        const storageRef = ref(this.storage, caballo.pdfPath);
        await deleteObject(storageRef).catch(err => console.error('Error al borrar PDF:', err));
      }
    }
  }
}