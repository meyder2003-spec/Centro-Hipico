import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Observador } from './observador';

describe('Observador', () => {
  let component: Observador;
  let fixture: ComponentFixture<Observador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Observador],
    }).compileComponents();

    fixture = TestBed.createComponent(Observador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
