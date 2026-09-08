import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Caballo } from '../../models/sistema.model';
import { CentroHipicoService } from '../../services/centro-hipico';

@Component({
  selector: 'app-observador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observador.html',
  styleUrls: ['./observador.css']
})
export class ObservadorComponent {
  public service = inject(CentroHipicoService);

  filtroTexto = signal<string>('');
  filtroEdad = signal<number | null>(null);

  // Señales para controlar la visibilidad y datos del modal de imagen
  imagenModalUrl = signal<string | null>(null);
  imagenModalTitulo = signal<string>('');

  // Declaración explícita del tipo retornado para la plantilla
  caballosFiltrados = computed<Caballo[]>(() => {
    const texto = this.filtroTexto().toLowerCase().trim();
    const edad = this.filtroEdad();

    const lista = (this.service.caballos() || []) as Caballo[];

    return lista.filter((c: Caballo) => {
      const coincideTexto = !texto || 
        (c.nombre || '').toLowerCase().includes(texto) || 
        (c.raza || '').toLowerCase().includes(texto);

      const coincideEdad = edad === null || c.edad === Number(edad);

      return coincideTexto && coincideEdad;
    });
  });

  // Métodos para abrir y cerrar la imagen a pantalla completa
  abrirImagenModal(url: string, nombre: string): void {
    this.imagenModalUrl.set(url);
    this.imagenModalTitulo.set(nombre);
  }

  cerrarImagenModal(): void {
    this.imagenModalUrl.set(null);
    this.imagenModalTitulo.set('');
  }

  actualizarFiltroTexto(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroTexto.set(input.value);
  }

  actualizarFiltroEdad(event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value !== '' ? Number(input.value) : null;
    this.filtroEdad.set(val);
  }

  limpiarFiltros(): void {
    this.filtroTexto.set('');
    this.filtroEdad.set(null);
  }
}