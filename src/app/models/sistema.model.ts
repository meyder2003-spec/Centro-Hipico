export type Rol = 'ADMIN' | 'OBSERVADOR';
export type EstadoUsuario = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  pass: string;
  rol: Rol;
  estado: EstadoUsuario;
}

export interface Caballo {
  id: string;
  nombre: string;
  raza: string;
  edad: number;
  sexo: string;
  establo: string;
  descripcion: string;
  imagenUrl: string;   // Foto del caballo (para la card)
  tarjetaUrl?: string; // Documento/Tarjeta oficial escaneada
}