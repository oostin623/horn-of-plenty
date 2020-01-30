import { TestBed } from '@angular/core/testing';

import { FoodLogService } from './food-log.service';

describe('FoodLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodLogService = TestBed.get(FoodLogService);
    expect(service).toBeTruthy();
  });
});
