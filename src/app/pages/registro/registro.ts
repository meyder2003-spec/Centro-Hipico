import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { RolUsuario } from '../../models/sistema.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private firestore = inject(Firestore);
  private router = inject(Router);

  nombre = '';
  email = '';
  pass = '';
  rolSeleccionado: RolUsuario = 'OBSERVADOR';

  mensajeExito = signal<boolean>(false);
  cargando = signal<boolean>(false);

  async registrar() {
    if (!this.nombre || !this.email || !this.pass) return;

    this.cargando.set(true);
    try {
      const userId = `USR-${Date.now()}`;
      const nuevoUsuario = {
        id: userId,
        nombre: this.nombre,
        email: this.email.toLowerCase().trim(),
        pass: this.pass,
        rol: this.rolSeleccionado,
        estado: 'PENDIENTE'
      };

      await setDoc(doc(this.firestore, `usuarios/${userId}`), nuevoUsuario);
      this.mensajeExito.set(true);
      setTimeout(() => this.router.navigate(['/login']), 3000);
    } catch (err) {
      console.error('Error al registrar usuario:', err);
    } finally {
      this.cargando.set(false);
    }
  }
}