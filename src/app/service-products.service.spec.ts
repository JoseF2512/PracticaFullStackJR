import { TestBed } from '@angular/core/testing';

import { ServiceProductsService } from './service-products.service';

describe('ServiceProductsService', () => {
  let service: ServiceProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
