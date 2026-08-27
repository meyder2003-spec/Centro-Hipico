import { Injectable, signal } from '@angular/core';
import { Usuario, Caballo } from '../models/sistema.model';

@Injectable({
  providedIn: 'root'
})
export class CentroHipicoService {
  private readonly STORAGE_USUARIOS = 'centro_hipico_usuarios';
  private readonly STORAGE_CABALLOS = 'centro_hipico_caballos';

  // Usuario Autenticado en la sesión
  usuarioSesion = signal<Usuario | null>(null);

  // Lista de Usuarios con carga persistente
  usuarios = signal<Usuario[]>(this.cargarUsuariosIniciales());

  // Inventario de Caballos con carga persistente
  caballos = signal<Caballo[]>(this.cargarCaballosIniciales());

  // -------------------------------------------------------------
  // MÉTODOS PRIVADOS DE PERSISTENCIA (localStorage)
  // -------------------------------------------------------------

  private cargarUsuariosIniciales(): Usuario[] {
    const guardados = localStorage.getItem(this.STORAGE_USUARIOS);
    if (guardados) {
      try {
        return JSON.parse(guardados);
      } catch (e) {
        console.error('Error al cargar usuarios desde localStorage:', e);
      }
    }
    // Usuarios por defecto si no existen datos guardados aún
    return [
      { id: '1', nombre: 'Administrador General', email: 'admin@militar.pe', pass: '123456', rol: 'ADMIN', estado: 'APROBADO' },
      { id: '2', nombre: 'Teniente Lopez (Observador)', email: 'lopez@militar.pe', pass: '123456', rol: 'OBSERVADOR', estado: 'PENDIENTE' }
    ];
  }

  private cargarCaballosIniciales(): Caballo[] {
    const guardados = localStorage.getItem(this.STORAGE_CABALLOS);
    if (guardados) {
      try {
        return JSON.parse(guardados);
      } catch (e) {
        console.error('Error al cargar caballos desde localStorage:', e);
      }
    }
    // Caballos por defecto si no existen datos guardados aún
    return [
      {
        id: 'CHM-01',
        nombre: 'Hercules Z',
        raza: 'Zangersheide',
        edad: 6,
        sexo: 'Macho',
        imagenUrl: 'https://i.pinimg.com/736x/94/e8/43/94e843349bece20bfc006074f4298247.jpg',
        establo: 'Equipo',
        descripcion: 'Excelente ejemplar para saltos y adiestramiento.'
      },
      {
        id: 'CHM-02',
        nombre: 'Tailandia Z',
        raza: 'Zangersheide',
        edad: 4,
        sexo: 'Hembra',
        imagenUrl: 'https://i.pinimg.com/736x/ce/d4/84/ced484f833f797f3f242d22c6d21c45f.jpg',
        establo: 'Maternidad',
        descripcion: 'Dócil y de rápida adaptación en maniobras.'
      }
    ];
  }

  private guardarUsuariosStorage(lista: Usuario[]) {
    localStorage.setItem(this.STORAGE_USUARIOS, JSON.stringify(lista));
  }

  private guardarCaballosStorage(lista: Caballo[]) {
    localStorage.setItem(this.STORAGE_CABALLOS, JSON.stringify(lista));
  }

  // -------------------------------------------------------------
  // AUTENTICACIÓN Y USUARIOS
  // -------------------------------------------------------------

  login(email: string, pass: string): { exito: boolean; msj: string } {
    const usr = this.usuarios().find(u => u.email === email && u.pass === pass);
    if (!usr) return { exito: false, msj: 'Credenciales incorrectas.' };
    if (usr.estado === 'PENDIENTE') return { exito: false, msj: 'Tu cuenta requiere aprobación del Administrador.' };
    if (usr.estado === 'RECHAZADO') return { exito: false, msj: 'Acceso denegado.' };

    this.usuarioSesion.set(usr);
    return { exito: true, msj: 'Bienvenido' };
  }

  registro(nombre: string, email: string, pass: string) {
    const nuevo: Usuario = {
      id: Date.now().toString(),
      nombre, email, pass,
      rol: 'OBSERVADOR',
      estado: 'PENDIENTE'
    };
    this.usuarios.update(u => {
      const listaActualizada = [...u, nuevo];
      this.guardarUsuariosStorage(listaActualizada);
      return listaActualizada;
    });
  }

  registrarUsuario(usuarioData: any) {
    const existe = this.usuarios().some(u => u.email === usuarioData.email);
    if (existe) {
      return { exito: false, msj: 'El correo electrónico ya se encuentra registrado.' };
    }

    const nuevoUsuario = {
      ...usuarioData,
      estado: 'PENDIENTE'
    };

    this.usuarios.update(lista => {
      const listaActualizada = [...lista, nuevoUsuario];
      this.guardarUsuariosStorage(listaActualizada);
      return listaActualizada;
    });

    return { exito: true, msj: 'Solicitud enviada con éxito.' };
  }

  logout() {
    this.usuarioSesion.set(null);
  }

  cambiarEstadoUsuario(id: string, estado: 'APROBADO' | 'RECHAZADO') {
    this.usuarios.update(list => {
      const listaActualizada = list.map(u => u.id === id ? { ...u, estado } : u);
      this.guardarUsuariosStorage(listaActualizada);
      return listaActualizada;
    });
  }
  // -------------------------------------------------------------
// CAMBIAR ROL DE USUARIO (OBSERVADOR <-> ADMIN)
// -------------------------------------------------------------
cambiarRolUsuario(id: string, nuevoRol: 'ADMIN' | 'OBSERVADOR') {
  this.usuarios.update(list => {
    const listaActualizada = list.map(u => u.id === id ? { ...u, rol: nuevoRol } : u);
    this.guardarUsuariosStorage(listaActualizada);
    return listaActualizada;
  });
}

  // -------------------------------------------------------------
  // CRUD CABALLOS (Persistencia de fotos y tarjetas de Cloudinary)
  // -------------------------------------------------------------

  agregarCaballo(caballo: Caballo) {
    this.caballos.update(c => {
      const listaActualizada = [...c, caballo];
      this.guardarCaballosStorage(listaActualizada);
      return listaActualizada;
    });
  }

  editarCaballo(caballo: Caballo) {
    this.caballos.update(c => {
      const listaActualizada = c.map(item => item.id === caballo.id ? caballo : item);
      this.guardarCaballosStorage(listaActualizada);
      return listaActualizada;
    });
  }

  eliminarCaballo(id: string) {
    this.caballos.update(c => {
      const listaActualizada = c.filter(item => item.id !== id);
      this.guardarCaballosStorage(listaActualizada);
      return listaActualizada;
    });
  }
}