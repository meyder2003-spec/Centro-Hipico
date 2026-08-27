import { Routes } from '@angular/router';

import { InicioPublico } from './pages/inicio-publico/inicio-publico';
import { CatalogoCaballos } from './pages/catalogo-caballos/catalogo-caballos';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { AdminUsuarios } from './pages/admin-usuarios/admin-usuarios';
import { authGuard } from './guards/auth.guard';// <-- Importamos el Guard de protección

export const routes: Routes = [
  { path: '', component: InicioPublico },
  { path: 'catalogo', component: CatalogoCaballos, canActivate: [authGuard] }, // <-- Protegido con canActivate
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'admin-usuarios', component: AdminUsuarios },
  { path: '**', redirectTo: '' }
];