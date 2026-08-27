import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CentroHipicoService } from '../../services/centro-hipico.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { Caballo } from '../../models/sistema.model';
import { ModalCaballo } from '../../components/modal-caballo/modal-caballo';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-catalogo-caballos',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalCaballo],
  templateUrl: './catalogo-caballos.html',
  styleUrl: './catalogo-caballos.css'
})
export class CatalogoCaballos {
  service = inject(CentroHipicoService);
  cloudinary = inject(CloudinaryService);
  sanitizer = inject(DomSanitizer);

  // Estados de carga independientes
  subiendoFoto = false;
  subiendoTarjeta = false;

  // Modal Ficha Caballo (General)
  caballoSeleccionado = signal<Caballo | null>(null);

  // Estado del Visor Exclusivo para la Tarjeta PDF
  tarjetaPdfUrl: SafeResourceUrl | null = null;

  // Filtros
  fNombre = signal('');
  fRaza = signal('');
  fEdad = signal<number | null>(null);
  fSexo = signal('');

  // Formulario Administrador
  modoEdicion = false;
  caballoForm: Caballo = this.resetForm();

  caballosFiltrados = computed(() => {
    return this.service.caballos().filter(c => {
      const nom = c.nombre.toLowerCase().includes(this.fNombre().toLowerCase());
      const raz = !this.fRaza() || c.raza === this.fRaza();
      const eda = !this.fEdad() || c.edad === Number(this.fEdad());
      const sex = !this.fSexo() || c.sexo === this.fSexo();
      return nom && raz && eda && sex;
    });
  });

verTarjetaExclusiva(tarjetaUrl: string | undefined, event: Event) {
  event.stopPropagation();

  if (!tarjetaUrl) {
    alert('Este caballo no tiene una tarjeta cargada.');
    return;
  }

  // Se asigna la URL sanitizada directamente
  this.tarjetaPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(tarjetaUrl);
}

cerrarVisorTarjeta() {
  this.tarjetaPdfUrl = null;
}

  // 1. Cargar Foto del Caballo a Cloudinary
  async onFotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.subiendoFoto = true;
      try {
        const urlGenerada = await this.cloudinary.subirImagen(input.files[0]);
        this.caballoForm.imagenUrl = urlGenerada;
      } catch (error) {
        alert('Error al subir la foto del caballo.');
        console.error(error);
      } finally {
        this.subiendoFoto = false;
      }
    }
  }

  // 2. Cargar Tarjeta del Caballo a Cloudinary
  async onTarjetaSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.subiendoTarjeta = true;
      try {
        const urlGenerada = await this.cloudinary.subirImagen(input.files[0]);
        this.caballoForm.tarjetaUrl = urlGenerada;
      } catch (error) {
        alert('Error al subir la tarjeta.');
        console.error(error);
      } finally {
        this.subiendoTarjeta = false;
      }
    }
  }

  // Métodos del Modal
  abrirModal(c: Caballo) {
    this.caballoSeleccionado.set(c);
  }

  cerrarModal() {
    this.caballoSeleccionado.set(null);
  }

  guardar() {
    if (this.modoEdicion) {
      this.service.editarCaballo({ ...this.caballoForm });
    } else {
      this.service.agregarCaballo({ ...this.caballoForm, id: 'CHM-' + Date.now().toString().slice(-3) });
    }
    this.caballoForm = this.resetForm();
    this.modoEdicion = false;
  }

  editar(c: Caballo) {
    this.caballoForm = { ...c };
    this.modoEdicion = true;
  }

  eliminar(id: string) {
    this.service.eliminarCaballo(id);
  }

  resetForm(): Caballo {
    return { id: '', nombre: '', raza: 'Pura Sangre', edad: 3, sexo: 'Macho', imagenUrl: '', tarjetaUrl: '', establo: '', descripcion: '' };
  }
}