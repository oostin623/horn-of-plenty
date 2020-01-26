import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFoodFormComponent } from './create-food-form.component';

describe('CreateFoodFormComponent', () => {
  let component: CreateFoodFormComponent;
  let fixture: ComponentFixture<CreateFoodFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFoodFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFoodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
