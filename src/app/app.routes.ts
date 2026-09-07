import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { CatalogoCaballos } from './pages/catalogo-caballos/catalogo-caballos';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.Login) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./pages/registro/registro').then(m => m.Registro) 
  },
  { 
    path: 'admin-dashboard', 
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    data: { rol: 'ADMIN' }
  },
  { 
    path: 'admin-usuarios', 
    loadComponent: () => import('./pages/admin-usuarios/admin-usuarios').then(m => m.AdminUsuarios),
    canActivate: [authGuard],
    data: { rol: 'ADMIN' }
  },
  { 
    path: 'observador', 
    loadComponent: () => import('./pages/observador/observador').then(m => m.ObservadorComponent),
    canActivate: [authGuard],
    data: { rol: 'OBSERVADOR' }
  },
{ 
    // Ruta que carga directamente tu CatalogoCaballos
    path: 'catalogo', 
    loadComponent: () => import('./pages/catalogo-caballos/catalogo-caballos').then(m => m.CatalogoCaballos),
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];