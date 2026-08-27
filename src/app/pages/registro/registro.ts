import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CentroHipicoService } from '../../services/centro-hipico.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  service = inject(CentroHipicoService);
  router = inject(Router);

  nombre = '';
  email = '';
  pass = '';

  mensajeError = signal('');
  mensajeExito = signal('');

  limpiarMensajes() {
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  async onRegistro() {
    this.limpiarMensajes();

    if (!this.nombre || !this.email || !this.pass) {
      this.mensajeError.set('Por favor completa todos los campos.');
      return;
    }

    // Usamos await para resolver la Promesa que retorna registrarUsuario
    const resultado = await this.service.registrarUsuario({
      id: 'USR-' + Date.now().toString().slice(-4),
      nombre: this.nombre,
      email: this.email,
      pass: this.pass,
      rol: 'OBSERVADOR'
    });

    if (resultado.exito) {
      this.mensajeExito.set('Registro exitoso. Redirigiendo al inicio de sesión...');
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    } else {
      this.mensajeError.set(resultado.msj);
    }
  }
}