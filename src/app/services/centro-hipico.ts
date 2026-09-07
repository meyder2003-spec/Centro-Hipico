import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  onSnapshot,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CloudinaryService } from './cloudinary';

// Tipos e Interfaces Exportadas
export type RolUsuario = 'ADMIN' | 'OBSERVADOR';
export type EstadoUsuario = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTIVO' | 'INACTIVO';

export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  pass?: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
}

export interface Caballo {
  id?: string;
  nombre: string;
  raza: string;
  edad: number;
  sexo?: string;
  establo?: string;
  descripcion?: string;
  imagenUrl?: string;
  pdfUrl?: string;
  tarjetaUrl?: string;
}

export const CABALLO_VACIO: Caballo = {
  nombre: '',
  raza: '',
  edad: 0,
  sexo: 'Macho',
  establo: '',
  imagenUrl: '',
  tarjetaUrl: '',
  descripcion: ''
};

export interface GaleriaImagen {
  id?: string;
  titulo: string;
  descripcion: string;
  url: string;
  fechaCreacion?: string;
}

@Injectable({ providedIn: 'root' })
export class CentroHipicoService {
  private firestore = inject(Firestore);
  private cloudinary = inject(CloudinaryService);

  // Estados Reactivos con Signals
  usuarios = signal<Usuario[]>([]);
  caballos = signal<Caballo[]>([]);
  galeria = signal<GaleriaImagen[]>([]);
  usuarioSesion = signal<Usuario | null>(null);

  constructor() {
    this.cargarDatosIniciales();
    this.recuperarSesion();
  }

  // -----------------------------------------------------------------
  // INICIALIZACIÓN Y SESIÓN
  // -----------------------------------------------------------------

  private recuperarSesion(): void {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      try {
        this.usuarioSesion.set(JSON.parse(userStr));
      } catch (e) {
        console.error('Error al parsear sesión previa:', e);
      }
    }
  }

  private cargarDatosIniciales(): void {
    // 1. USUARIOS
    const usuariosRef = collection(this.firestore, 'usuarios');
    onSnapshot(usuariosRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Usuario));
      this.usuarios.set(data);
    }, (err) => console.error('Error al cargar usuarios:', err));

    // 2. CABALLOS
    const caballosRef = collection(this.firestore, 'caballos');
    onSnapshot(caballosRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Caballo));
      this.caballos.set(data);
    }, (err) => console.error('Error al cargar caballos:', err));

    // 3. GALERÍA
    const galeriaRef = collection(this.firestore, 'galeria');
    onSnapshot(galeriaRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GaleriaImagen));
      this.galeria.set(data);
    }, (err) => console.error('Error al cargar galería:', err));
  }

  // -----------------------------------------------------------------
  // AUTENTICACIÓN
  // -----------------------------------------------------------------

  async login(email: string, pass: string): Promise<Usuario> {
    const user = this.usuarios().find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);

    if (!user) {
      throw new Error('Correo o contraseña incorrectos.');
    }

    if (user.estado === 'PENDIENTE') {
      throw new Error('Tu cuenta se encuentra pendiente de aprobación por el administrador.');
    }

    if (user.estado === 'INACTIVO' || user.estado === 'RECHAZADO') {
      throw new Error('Tu cuenta se encuentra inactiva o ha sido rechazada.');
    }

    this.usuarioSesion.set(user);
    localStorage.setItem('usuario', JSON.stringify(user));
    return user;
  }

  async registrarUsuario(nombre: string, email: string, pass: string, rol: RolUsuario = 'OBSERVADOR'): Promise<void> {
    const existe = this.usuarios().some(u => u.email.toLowerCase() === email.toLowerCase());
    if (existe) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }

    const nuevoUsuario: Omit<Usuario, 'id'> = {
      nombre,
      email,
      pass,
      rol,
      estado: 'PENDIENTE'
    };

    const usuariosRef = collection(this.firestore, 'usuarios');
    await addDoc(usuariosRef, nuevoUsuario);
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSesion.set(null);
  }

  // -----------------------------------------------------------------
  // GESTIÓN DE USUARIOS
  // -----------------------------------------------------------------

  async cambiarEstadoUsuario(id: string, nuevoEstado: EstadoUsuario | string): Promise<void> {
    const userDoc = doc(this.firestore, `usuarios/${id}`);
    await updateDoc(userDoc, { estado: nuevoEstado });
  }

  async cambiarRolUsuario(id: string, nuevoRol: RolUsuario): Promise<void> {
    const userDoc = doc(this.firestore, `usuarios/${id}`);
    await updateDoc(userDoc, { rol: nuevoRol });
  }

  async eliminarUsuario(id: string): Promise<void> {
    const userDoc = doc(this.firestore, `usuarios/${id}`);
    await deleteDoc(userDoc);
  }

  // -----------------------------------------------------------------
  // GESTIÓN DE CABALLOS
  // -----------------------------------------------------------------

  getCaballos(): Observable<Caballo[]> {
    return new Observable((observer) => {
      const caballosRef = collection(this.firestore, 'caballos');
      return onSnapshot(caballosRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Caballo));
        observer.next(data);
      }, (error) => observer.error(error));
    });
  }

  async agregarCaballo(caballo: Caballo, pdfFile?: File, imgFile?: File): Promise<void> {
    const nuevoCaballo: Caballo = { ...caballo };

    if (pdfFile) {
      const pdfUrl = await this.cloudinary.subirArchivo(pdfFile);
      nuevoCaballo.pdfUrl = pdfUrl;
      nuevoCaballo.tarjetaUrl = pdfUrl;
    }

    if (imgFile) {
      nuevoCaballo.imagenUrl = await this.cloudinary.subirArchivo(imgFile);
    }

    const caballosRef = collection(this.firestore, 'caballos');
    await addDoc(caballosRef, nuevoCaballo);
  }

  async actualizarCaballo(id: string, caballo: Partial<Caballo>, pdfFile?: File, imgFile?: File): Promise<void> {
    const caballoDoc = doc(this.firestore, `caballos/${id}`);
    const actualizacion: Partial<Caballo> = { ...caballo };

    if (pdfFile) {
      const pdfUrl = await this.cloudinary.subirArchivo(pdfFile);
      actualizacion.pdfUrl = pdfUrl;
      actualizacion.tarjetaUrl = pdfUrl;
    }

    if (imgFile) {
      actualizacion.imagenUrl = await this.cloudinary.subirArchivo(imgFile);
    }

    await updateDoc(caballoDoc, actualizacion);
  }

  async eliminarCaballo(caballoOrId: Caballo | string): Promise<void> {
    const id = typeof caballoOrId === 'string' ? caballoOrId : caballoOrId.id;
    if (id) {
      const caballoDoc = doc(this.firestore, `caballos/${id}`);
      await deleteDoc(caballoDoc);
    }
  }

  // -----------------------------------------------------------------
  // GESTIÓN DE GALERÍA
  // -----------------------------------------------------------------

  getGaleria(): Observable<GaleriaImagen[]> {
    return new Observable((observer) => {
      const galeriaRef = collection(this.firestore, 'galeria');
      return onSnapshot(galeriaRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GaleriaImagen));
        observer.next(data);
      }, (error) => observer.error(error));
    });
  }

  async agregarImagenGaleria(titulo: string, descripcion: string, archivo: File): Promise<void> {
    const url = await this.cloudinary.subirArchivo(archivo);
    const galeriaRef = collection(this.firestore, 'galeria');
    await addDoc(galeriaRef, {
      titulo,
      descripcion,
      url,
      fechaCreacion: new Date().toISOString()
    });
  }

  async eliminarImagenGaleria(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `galeria/${id}`));
  }
}