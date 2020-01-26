import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDatabaseSearchComponent } from './food-database-search.component';

describe('FoodDatabaseSearchComponent', () => {
  let component: FoodDatabaseSearchComponent;
  let fixture: ComponentFixture<FoodDatabaseSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodDatabaseSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodDatabaseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
