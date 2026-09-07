import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentroHipicoService } from '../../services/centro-hipico';
import { RolUsuario, EstadoUsuario } from '../../models/sistema.model';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css'
})
export class AdminUsuarios {
  public service = inject(CentroHipicoService);

  usuariosPendientes = computed(() => {
    const lista = this.service.usuarios() || [];
    return lista.filter(u => u.estado === 'PENDIENTE');
  });

  usuariosProcesados = computed(() => {
    const lista = this.service.usuarios() || [];
    return lista.filter(u => u.estado !== 'PENDIENTE');
  });

  aprobar(id: string) {
    this.service.cambiarEstadoUsuario(id, 'APROBADO');
  }

  rechazar(id: string) {
    this.service.cambiarEstadoUsuario(id, 'RECHAZADO');
  }

  cambiarRol(id: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    const nuevoRol = select.value as RolUsuario;
    this.service.cambiarRolUsuario(id, nuevoRol);
  }

  eliminar(id: string) {
    if (confirm('¿Desea eliminar este usuario del registro?')) {
      this.service.eliminarUsuario(id);
    }
  }
}