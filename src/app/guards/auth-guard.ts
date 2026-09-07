import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CentroHipicoService, Usuario } from '../services/centro-hipico';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(CentroHipicoService);
  const router = inject(Router);

  // 1. Intentar obtener la sesión del Signal o respaldarse directamente en LocalStorage
  let usuario: Usuario | null = service.usuarioSesion();

  if (!usuario) {
    const localUser = localStorage.getItem('usuario');
    if (localUser) {
      try {
        usuario = JSON.parse(localUser);
        service.usuarioSesion.set(usuario); // Sincronizar la señal si estaba vacía
      } catch (e) {
        console.error('Error al parsear el usuario del localStorage', e);
      }
    }
  }

  // 2. Si no hay usuario en ningún lado, redirigir al login
  if (!usuario) {
    router.navigate(['/login']);
    return false;
  }

  // 3. Validar estados permitidos (APROBADO o ACTIVO)
  const esEstadoValido = usuario.estado === 'ACTIVO' || usuario.estado === 'APROBADO';
  if (!esEstadoValido) {
    service.logout();
    router.navigate(['/login']);
    return false;
  }

  // 4. Validar rol según el parámetro "data" configurado en app.routes.ts
  const rolRequerido = route.data?.['rol'] as string;
  if (rolRequerido && usuario.rol !== rolRequerido) {
    if (usuario.rol === 'OBSERVADOR') {
      router.navigate(['/observador']);
    } else {
      router.navigate(['/admin-dashboard']);
    }
    return false;
  }

  return true;
};