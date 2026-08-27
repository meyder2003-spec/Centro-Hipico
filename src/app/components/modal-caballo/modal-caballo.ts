import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Caballo } from '../../models/sistema.model';

@Component({
  selector: 'app-modal-caballo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-caballo.html',
  styleUrl: './modal-caballo.css'
})
export class ModalCaballo {
  @Input() caballo: Caballo | null = null;
  @Output() cerrar = new EventEmitter<void>();

  onCerrar() {
    this.cerrar.emit();
  }
}