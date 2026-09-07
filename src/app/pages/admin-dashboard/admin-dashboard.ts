import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  CentroHipicoService, 
  Usuario, 
  RolUsuario, 
  EstadoUsuario 
} from '../../services/centro-hipico';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  public centroHipicoService = inject(CentroHipicoService);

  cargando = signal<boolean>(false);

  // Asegura la lectura dinámica de la señal desde el servicio
  solicitudesPendientes = computed(() => {
    const lista = this.centroHipicoService.usuarios();
    return lista.filter(u => u.estado === 'PENDIENTE' || !u.estado);
  });

  usuariosAprobados = computed(() => {
    const lista = this.centroHipicoService.usuarios();
    return lista.filter(u => 
      u.estado === 'APROBADO' || u.estado === 'ACTIVO' || u.estado === 'INACTIVO'
    );
  });

  ngOnInit(): void {
    // Si la lista local del servicio aún no tiene datos, mostramos el indicador de carga brevemente
    if (this.centroHipicoService.usuarios().length === 0) {
      this.cargando.set(true);
      const sub = setInterval(() => {
        if (this.centroHipicoService.usuarios().length > 0) {
          this.cargando.set(false);
          clearInterval(sub);
        }
      }, 300);
      
      // Límite de tiempo para quitar el spinner
      setTimeout(() => {
        this.cargando.set(false);
        clearInterval(sub);
      }, 3000);
    }
  }

  async aprobarSolicitud(id: string | undefined): Promise<void> {
    if (!id) return;
    try {
      this.cargando.set(true);
      await this.centroHipicoService.cambiarEstadoUsuario(id, 'ACTIVO');
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  async rechazarSolicitud(id: string | undefined): Promise<void> {
    if (!id) return;
    if (confirm('¿Está seguro de rechazar y eliminar esta solicitud?')) {
      try {
        this.cargando.set(true);
        await this.centroHipicoService.eliminarUsuario(id);
      } catch (error) {
        console.error('Error al rechazar solicitud:', error);
      } finally {
        this.cargando.set(false);
      }
    }
  }

  async cambiarRol(id: string | undefined, event: Event): Promise<void> {
    if (!id) return;
    const selectElement = event.target as HTMLSelectElement;
    const nuevoRol = selectElement.value as RolUsuario;
    try {
      await this.centroHipicoService.cambiarRolUsuario(id, nuevoRol);
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    }
  }

  async cambiarEstado(id: string | undefined, event: Event): Promise<void> {
    if (!id) return;
    const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value as EstadoUsuario;
    try {
      await this.centroHipicoService.cambiarEstadoUsuario(id, nuevoEstado);
    } catch (error) {
      console.error('Error al cambiar el estado del usuario:', error);
    }
  }
}