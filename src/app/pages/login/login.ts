import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CentroHipicoService } from '../../services/centro-hipico.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  service = inject(CentroHipicoService);
  router = inject(Router);

  email = '';
  pass = '';

  mensajeError = signal('');
  mensajeExito = signal('');

  limpiarMensajes() {
    this.mensajeError.set('');
    this.mensajeExito.set('');
  }

  async onLogin() {
    this.limpiarMensajes();
    
    if (!this.email || !this.pass) {
      this.mensajeError.set('Por favor completa todos los campos.');
      return;
    }

    // Usamos await para esperar a que Firestore devuelva la promesa
    const resultado = await this.service.login(this.email, this.pass);

    if (resultado.exito) {
      this.router.navigate(['/catalogo']);
    } else {
      this.mensajeError.set(resultado.msj);
    }
  }
}