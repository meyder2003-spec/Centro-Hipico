export type RolUsuario = 'ADMIN' | 'OBSERVADOR';

// Se agregan 'ACTIVO' e 'INACTIVO' para que TypeScript permita el control de usuarios en el dashboard
export type EstadoUsuario = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ACTIVO' | 'INACTIVO';

export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  pass: string;
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
  tarjetaUrl?: string;
  pdfUrl?: string;
  pdfPath?: string;
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
  descripcion?: string;
  url: string;
  fechaCreacion?: Date | string;
}