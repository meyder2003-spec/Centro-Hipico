import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CentroHipicoService } from '../../services/centro-hipico';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  public service = inject(CentroHipicoService);
  private router = inject(Router);

  // Estado para controlar el menú responsive de 3 rayitas
  menuAbierto = signal<boolean>(false);

  // Lista de Comunicados
  anuncios: string[] = [
    'Registro de Ejemplares Equinos de Alta Competencia',
    'Centro de Adiestramiento y Registro Sanitario Veterinario',
    'Plataforma Oficial del Patrimonio Equino Institucional'
  ];

  // Señal para controlar el índice actual del carrusel
  anuncioActivo = signal<number>(0);
  private timer: any;

  ngOnInit(): void {
    this.iniciarAutoplay();
  }

  ngOnDestroy(): void {
    this.detenerAutoplay();
  }

  // Métodos para el menú hamburguesa
  toggleMenu(): void {
    this.menuAbierto.update(estado => !estado);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  // Métodos del Carrusel
  iniciarAutoplay(): void {
    this.detenerAutoplay();
    this.timer = setInterval(() => {
      this.siguienteAnuncio();
    }, 4000); // Cambia automáticamente cada 4 segundos
  }

  detenerAutoplay(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  siguienteAnuncio(): void {
    const siguiente = (this.anuncioActivo() + 1) % this.anuncios.length;
    this.anuncioActivo.set(siguiente);
  }

  anuncioAnterior(): void {
    const anterior = (this.anuncioActivo() - 1 + this.anuncios.length) % this.anuncios.length;
    this.anuncioActivo.set(anterior);
  }

  irAnuncio(index: number): void {
    this.anuncioActivo.set(index);
    this.iniciarAutoplay(); // Reinicia el tiempo al hacer clic manualmente
  }

  salir(): void {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}