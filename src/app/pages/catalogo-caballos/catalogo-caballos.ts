import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CentroHipicoService, Caballo, CABALLO_VACIO } from '../../services/centro-hipico';

@Component({
  selector: 'app-catalogo-caballos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo-caballos.html',
  styleUrls: ['./catalogo-caballos.css']
})
export class CatalogoCaballos implements OnInit {
  public service = inject(CentroHipicoService);

  usuario = this.service.usuarioSesion;
  caballos = signal<Caballo[]>([]);
  filtroNombre = signal<string>('');
  filtroRaza = signal<string>('');
  filtroEdad = signal<number | null>(null);

  mostrarModal = signal<boolean>(false);
  modoEdicion = signal<boolean>(false);
  caballoIdSeleccionado = signal<string | null>(null);

  // Signal para gestionar el modal de vista previa de imagen a pantalla completa
  imagenSeleccionada = signal<string | null>(null);

  // Inicialización con las propiedades del modelo completo
  nuevoCaballo: Partial<Caballo> = { ...CABALLO_VACIO };
  
  archivoPdfSeleccionado: File | null = null;
  archivoImagenSeleccionado: File | null = null;
  cargando = signal<boolean>(false);

  caballosFiltrados = computed(() => {
    return this.service.caballos().filter((c: Caballo) => {
      const coincideNombre = (c.nombre || '').toLowerCase().includes(this.filtroNombre().toLowerCase());
      const coincideRaza = (c.raza || '').toLowerCase().includes(this.filtroRaza().toLowerCase());
      const coincideEdad = this.filtroEdad() === null || c.edad === Number(this.filtroEdad());
      return coincideNombre && coincideRaza && coincideEdad;
    });
  });

  ngOnInit(): void {
    this.service.getCaballos().subscribe({
      next: (data: Caballo[]) => this.caballos.set(data),
      error: (err: any) => console.error('Error al cargar caballos:', err)
    });
  }

  // Métodos para el control del visor de imagen a pantalla completa
  verImagenCompleta(url: string): void {
    this.imagenSeleccionada.set(url);
  }

  cerrarImagenCompleta(): void {
    this.imagenSeleccionada.set(null);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.archivoPdfSeleccionado = file;
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.archivoImagenSeleccionado = file;
    }
  }

  abrirModalCrear(): void {
    this.modoEdicion.set(false);
    this.caballoIdSeleccionado.set(null);
    this.nuevoCaballo = { ...CABALLO_VACIO };
    this.archivoPdfSeleccionado = null;
    this.archivoImagenSeleccionado = null;
    this.mostrarModal.set(true);
  }

  abrirModalEditar(caballo: Caballo): void {
    this.modoEdicion.set(true);
    this.caballoIdSeleccionado.set(caballo.id || null);
    this.nuevoCaballo = { ...caballo };
    this.archivoPdfSeleccionado = null;
    this.archivoImagenSeleccionado = null;
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.modoEdicion.set(false);
    this.caballoIdSeleccionado.set(null);
    this.nuevoCaballo = { ...CABALLO_VACIO };
    this.archivoPdfSeleccionado = null;
    this.archivoImagenSeleccionado = null;
  }

  async eliminarCaballo(caballo: Caballo): Promise<void> {
    if (!caballo.id) return;
    if (confirm(`¿Está seguro de eliminar a ${caballo.nombre}?`)) {
      try {
        await this.service.eliminarCaballo(caballo);
      } catch (error) {
        console.error('Error al eliminar caballo:', error);
      }
    }
  }

  async guardarCaballo(): Promise<void> {
    if (!this.nuevoCaballo.nombre || !this.nuevoCaballo.raza) return;

    this.cargando.set(true);
    try {
      if (this.modoEdicion() && this.caballoIdSeleccionado()) {
        await this.service.actualizarCaballo(
          this.caballoIdSeleccionado()!,
          this.nuevoCaballo,
          this.archivoPdfSeleccionado || undefined,
          this.archivoImagenSeleccionado || undefined
        );
      } else {
        await this.service.agregarCaballo(
          this.nuevoCaballo as Caballo,
          this.archivoPdfSeleccionado || undefined,
          this.archivoImagenSeleccionado || undefined
        );
      }
      this.cerrarModal();
    } catch (error) {
      console.error('Error al guardar caballo:', error);
    } finally {
      this.cargando.set(false);
    }
  }
}