import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoCaballos } from './catalogo-caballos';

describe('CatalogoCaballos', () => {
  let component: CatalogoCaballos;
  let fixture: ComponentFixture<CatalogoCaballos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoCaballos],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoCaballos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
