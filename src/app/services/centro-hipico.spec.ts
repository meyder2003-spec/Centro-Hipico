import { TestBed } from '@angular/core/testing';

import { CentroHipicoService } from './centro-hipico';

describe('CentroHipico', () => {
  let service: CentroHipicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentroHipicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
