import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CentroHipicoService } from '../../services/centro-hipico';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private service = inject(CentroHipicoService);
  private router = inject(Router);

  email = '';
  pass = '';
  errorMsg = signal<string | null>(null);
  cargando = signal<boolean>(false);

  async iniciarSesion() {
    this.errorMsg.set(null);

    // Validar campos vacíos
    if (!this.email.trim() || !this.pass.trim()) {
      this.errorMsg.set('Por favor, ingrese su correo y contraseña.');
      return;
    }

    try {
      this.cargando.set(true);

      // Consumir el método asíncrono del servicio
      const usuario = await this.service.login(this.email.trim(), this.pass);

      // Redirección según el rol retornado
      if (usuario.rol === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/observador']);
      }

    } catch (error: any) {
      // Capturar mensajes personalizados lanzados desde el servicio
      this.errorMsg.set(error.message || 'Ocurrió un error al intentar iniciar sesión.');
    } finally {
      this.cargando.set(false);
    }
  }
}