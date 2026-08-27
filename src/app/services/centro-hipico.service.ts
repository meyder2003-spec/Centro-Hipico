import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc, getDocs } from '@angular/fire/firestore';
import { Usuario, Caballo } from '../models/sistema.model';

@Injectable({
  providedIn: 'root'
})
export class CentroHipicoService {
  private firestore = inject(Firestore);

  usuarioSesion = signal<Usuario | null>(null);
  usuarios = signal<Usuario[]>([]);
  caballos = signal<Caballo[]>([]);

  constructor() {
    this.escucharUsuarios();
    this.escucharCaballos();
  }

  private escucharUsuarios() {
    const ref = collection(this.firestore, 'usuarios');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.usuarios.set(data as Usuario[]);
      if (data.length === 0) {
        this.sembrarUsuariosIniciales();
      }
    });
  }

  private escucharCaballos() {
    const ref = collection(this.firestore, 'caballos');
    collectionData(ref, { idField: 'id' }).subscribe((data) => {
      this.caballos.set(data as Caballo[]);
      if (data.length === 0) {
        this.sembrarCaballosIniciales();
      }
    });
  }

  private async sembrarUsuariosIniciales() {
    const iniciales: Usuario[] = [
      { id: '1', nombre: 'Administrador General', email: 'admin@militar.pe', pass: '123456', rol: 'ADMIN', estado: 'APROBADO' },
      { id: '2', nombre: 'Teniente Lopez (Observador)', email: 'lopez@militar.pe', pass: '123456', rol: 'OBSERVADOR', estado: 'PENDIENTE' }
    ];
    for (const u of iniciales) {
      await setDoc(doc(this.firestore, `usuarios/${u.id}`), u);
    }
  }

  private async sembrarCaballosIniciales() {
    const iniciales: Caballo[] = [
      {
        id: 'CHM-01',
        nombre: 'Hercules Z',
        raza: 'Zangersheide',
        edad: 6,
        sexo: 'Macho',
        imagenUrl: 'https://i.pinimg.com/736x/94/e8/43/94e843349bece20bfc006074f4298247.jpg',
        establo: 'Equipo',
        descripcion: 'Excelente ejemplar para saltos y adiestramiento.'
      }
    ];
    for (const c of iniciales) {
      await setDoc(doc(this.firestore, `caballos/${c.id}`), c);
    }
  }

  async login(email: string, pass: string): Promise<{ exito: boolean; msj: string }> {
    let lista = this.usuarios();
    if (lista.length === 0) {
      const snapshot = await getDocs(collection(this.firestore, 'usuarios'));
      lista = snapshot.docs.map(doc => doc.data() as Usuario);
    }

    const usr = lista.find(u => u.email === email && u.pass === pass);
    if (!usr) return { exito: false, msj: 'Credenciales incorrectas.' };
    if (usr.estado === 'PENDIENTE') return { exito: false, msj: 'Tu cuenta requiere aprobación del Administrador.' };
    if (usr.estado === 'RECHAZADO') return { exito: false, msj: 'Acceso denegado.' };

    this.usuarioSesion.set(usr);
    return { exito: true, msj: 'Bienvenido' };
  }

  async registrarUsuario(usuarioData: any): Promise<{ exito: boolean; msj: string }> {
    const existe = this.usuarios().some(u => u.email === usuarioData.email);
    if (existe) {
      return { exito: false, msj: 'El correo electrónico ya se encuentra registrado.' };
    }

    const id = usuarioData.id || Date.now().toString();
    const nuevoUsuario = { ...usuarioData, id, estado: 'PENDIENTE' };
    await setDoc(doc(this.firestore, `usuarios/${id}`), nuevoUsuario);
    return { exito: true, msj: 'Solicitud enviada con éxito.' };
  }

  async cambiarEstadoUsuario(id: string, estado: 'APROBADO' | 'RECHAZADO') {
    const docRef = doc(this.firestore, `usuarios/${id}`);
    await updateDoc(docRef, { estado });
  }

  async cambiarRolUsuario(id: string, nuevoRol: 'ADMIN' | 'OBSERVADOR') {
    const docRef = doc(this.firestore, `usuarios/${id}`);
    await updateDoc(docRef, { rol: nuevoRol });
  }

  async agregarCaballo(caballo: Caballo) {
    const id = caballo.id || `CHM-${Date.now()}`;
    await setDoc(doc(this.firestore, `caballos/${id}`), { ...caballo, id });
  }

  async editarCaballo(caballo: Caballo) {
    await setDoc(doc(this.firestore, `caballos/${caballo.id}`), caballo, { merge: true });
  }

  async eliminarCaballo(id: string) {
    await deleteDoc(doc(this.firestore, `caballos/${id}`));
  }

  logout() {
    this.usuarioSesion.set(null);
  }
}