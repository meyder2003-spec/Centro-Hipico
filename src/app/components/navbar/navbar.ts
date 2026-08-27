import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CentroHipicoService } from '../../services/centro-hipico.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar{
  service = inject(CentroHipicoService);
  router = inject(Router);

  salir() {
    this.service.logout();
    this.router.navigate(['/login']);
  }
}