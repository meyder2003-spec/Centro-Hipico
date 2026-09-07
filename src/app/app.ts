import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer'; // 👈 Importar Footer

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer], // 👈 Agregar Footer
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}