import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CentroHipicoService } from '../services/centro-hipico.service';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(CentroHipicoService);
  const router = inject(Router);

  // Si el usuario inició sesión, permite el acceso al catálogo
  if (service.usuarioSesion()) {
    return true;
  }

  // Si no está autenticado, muestra alerta y redirige al login
  alert('Debes iniciar sesión para ver el catálogo de caballos.');
  router.navigate(['/login']);
  return false;
};