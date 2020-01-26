import { TestBed } from '@angular/core/testing';

import { FoodDatabaseService } from './food-database.service';

describe('FoodDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodDatabaseService = TestBed.get(FoodDatabaseService);
    expect(service).toBeTruthy();
  });
});
