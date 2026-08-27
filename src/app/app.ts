import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar} from './components/navbar/navbar';
import { Footer} from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .main-content { 
      min-height: 80vh; 
      padding: 20px; 
      background-color: #f4f6f8; 
    }
  `]
})
export class App{}