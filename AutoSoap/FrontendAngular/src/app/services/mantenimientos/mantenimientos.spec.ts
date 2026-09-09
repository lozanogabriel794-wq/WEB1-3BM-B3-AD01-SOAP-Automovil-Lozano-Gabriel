import { TestBed } from '@angular/core/testing';
import { Mantenimientos } from './mantenimientos';

describe('Mantenimientos', () => {
  let service: Mantenimientos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mantenimientos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
