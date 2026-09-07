import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CentroHipicoService } from '../../services/centro-hipico';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio {
  public service = inject(CentroHipicoService);
  // Control del modal y formulario
  mostrarModal = signal<boolean>(false);
  cargando = signal<boolean>(false);

  nuevoTitulo = '';
  nuevaDescripcion = '';
  archivoSeleccionado: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  async guardarImagen(): Promise<void> {
    if (!this.nuevoTitulo || !this.archivoSeleccionado) {
      alert('Por favor ingrese el título y seleccione una imagen.');
      return;
    }

    this.cargando.set(true);
    try {
      await this.service.agregarImagenGaleria(
        this.nuevoTitulo,
        this.nuevaDescripcion,
        this.archivoSeleccionado
      );
      this.limpiarFormulario();
      this.mostrarModal.set(false);
    } catch (error) {
      console.error('Error al guardar la fotografía:', error);
      alert('Ocurrió un error al subir la imagen.');
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarImagen(id?: string): Promise<void> {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar esta fotografía de la galería?')) {
      try {
        await this.service.eliminarImagenGaleria(id);
      } catch (error) {
        console.error('Error al eliminar fotografía:', error);
      }
    }
  }

  private limpiarFormulario(): void {
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.archivoSeleccionado = null;
  }
}