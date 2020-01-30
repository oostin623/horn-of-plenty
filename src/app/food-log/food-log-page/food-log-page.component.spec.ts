import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodLogPageComponent } from './food-log-page.component';

describe('FoodLogPageComponent', () => {
  let component: FoodLogPageComponent;
  let fixture: ComponentFixture<FoodLogPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodLogPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodLogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
