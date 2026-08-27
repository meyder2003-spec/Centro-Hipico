import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CentroHipicoService } from '../../services/centro-hipico.service';
import { Usuario } from '../../models/sistema.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css'
})
export class AdminUsuarios {
  service = inject(CentroHipicoService);
  router = inject(Router);

  constructor() {
    // Redirigir si el usuario no tiene permisos de Administrador
    if (this.service.usuarioSesion()?.rol !== 'ADMIN') {
      this.router.navigate(['/']);
    }
  }

  // Lista de usuarios filtrados por pendientes en tiempo real
  usuariosPendientes = computed(() => 
    this.service.usuarios().filter(u => u.estado === 'PENDIENTE')
  );

  // Lista de usuarios procesados (Aprobados / Rechazados)
  usuariosProcesados = computed(() => 
    this.service.usuarios().filter(u => u.estado !== 'PENDIENTE')
  );

  async aprobar(id: string) {
    await this.service.cambiarEstadoUsuario(id, 'APROBADO');
  }

  async rechazar(id: string) {
    await this.service.cambiarEstadoUsuario(id, 'RECHAZADO');
  }

  async cambiarRol(id: string, nuevoRol: 'ADMIN' | 'OBSERVADOR') {
    await this.service.cambiarRolUsuario(id, nuevoRol);
  }
}