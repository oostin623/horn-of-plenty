import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDatabasePageComponent } from './food-database-page.component';

describe('FoodDatabasePageComponent', () => {
  let component: FoodDatabasePageComponent;
  let fixture: ComponentFixture<FoodDatabasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodDatabasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodDatabasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
