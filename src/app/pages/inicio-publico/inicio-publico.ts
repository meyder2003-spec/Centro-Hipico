import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio-publico',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio-publico.html',
  styleUrl: './inicio-publico.css'
})
export class InicioPublico {
  private router = inject(Router);

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}